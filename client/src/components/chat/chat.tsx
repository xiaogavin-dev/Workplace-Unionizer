"use client";
import { FC, useRef, useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import { userType } from "../../lib/redux/features/auth/authSlice";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatHeader, ChatBody, ChatInput } from "./chatHeader";
import { io, Socket } from "socket.io-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppSelector } from "@/lib/redux/hooks/redux";
import { usePathname } from "next/navigation";
import { encryptMessage, encryptSymmetricKeys, createSymmetricKey, decryptMessage } from "../../lib/util/encryptionCalls"
import { retrievePrivateKey } from '@/lib/util/IndexedDBCalls';
import { handleNewChatMember } from "@/lib/util/handleKeyUpdates";
import { useSocket } from "../socket/SocketProvider";
const PATH = "http://localhost:5000";

const FormSchema = z.object({
    message: z.string(),
});

interface messageInfo {
    id: string;
    content: string;
    userId: string;
    userDn: string | null,
    chatId: string;
    createdAt: Date;
    updatedAt: Date;
    keyVersionId: string | null | undefined
}

interface messageType {
    messages: messageInfo[] | null;
}

interface roomInfoType {
    createdAt: string | null;
    id: string | null;
    name: string | null;
    chatKeyVersion: string | null,
    isPublic: boolean,
    isDefault: boolean,
    unionId: string | null;
    updatedAt: string | null;
    workplaceId: string | null;
}

export interface RoomType {
    room: roomInfoType | null;
}



const Chat: FC = () => {
    const { user } = useAppSelector((state): { user: userType | null } => state.auth);
    const socket = useSocket()
    const pathname = usePathname();
    const chunks = pathname.split("/");
    const socketRef = useRef<Socket | null>();
    const [isConnected, setIsConnected] = useState<boolean>(true)
    const [roomData, setRoomData] = useState<RoomType>({ room: null });
    const [messages, setMessages] = useState<messageType>({ messages: [] });
    const [init, setInit] = useState<boolean>(false)
    const [loadingMessages, setLoadingMessages] = useState<boolean>(true)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });
    useEffect(() => {
        if (socket) {
            socketRef.current = socket;

            // Check if the socket is connected
            setIsConnected(socket.connected);

            // Listen to the 'connect' and 'disconnect' events
            socket.on("connect", () => {
                console.log("Socket connected");
                setIsConnected(true);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
                setIsConnected(false);
            });

            // Clean up listeners
            return () => {
                socket.off("connect");
                socket.off("disconnect");
            };
        }
    }, [socket]);
    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        console.log(socketRef.current?.connected)
        if (socketRef.current?.connected) {
            console.log("hit after")
            const msg_details: messageInfo = {
                id: crypto.randomUUID(),
                content: data.message,
                userId: user?.uid ?? "",
                userDn: user?.displayName ?? "",
                chatId: chunks[chunks.length - 1],
                createdAt: new Date(),
                updatedAt: new Date(),
                keyVersionId: roomData.room?.chatKeyVersion
            };

            setMessages((old) => ({
                messages: [msg_details, ...(old.messages ?? [])],
            }));
            let encryptedMessageDetails: messageInfo | null = null
            socketRef.current.emit("SEND_MSG", msg_details, roomData);
            const createMessage = async (msg_details: messageInfo) => {
                try {
                    //if there is no keyVersion for the current room create a new encryption key
                    let encryptedKeyData = null
                    if (roomData.room?.chatKeyVersion == null) {
                        try {
                            const { newRoomInfo, userKeyData } = await handleNewChatMember(roomData.room, user?.uid)
                            encryptedKeyData = userKeyData
                            const fetchPrivKey = async () => {
                                const privateKey = await retrievePrivateKey(user!.uid)
                                return privateKey
                            }
                            const privateKey = await fetchPrivKey()
                            const encryptedSymmetricKey = encryptedKeyData?.data.encryptedKey
                            const message = msg_details.content
                            const { encryptedMessage } = await encryptMessage(message, privateKey, encryptedSymmetricKey)
                            encryptedMessageDetails = { ...msg_details, content: encryptedMessage, keyVersionId: newRoomInfo?.chatKeyVersion }
                            setRoomData({ room: newRoomInfo })
                        } catch (error) {
                            console.log("WE NEVER GET PAST THIS POINT")
                            return
                        }
                    }
                    else {
                        // grab the encrypted key
                        const response = await fetch(`${PATH}/chat/getEncryptedKey?userId=${user?.uid}&chatKeyVersion=${roomData.room?.chatKeyVersion}`)
                        if (!response.ok) {
                            throw new Error("There was an error getting your encrypted symmetric key")
                        }
                        encryptedKeyData = await response.json()
                        const fetchPrivKey = async () => {
                            const privateKey = await retrievePrivateKey(user!.uid)
                            return privateKey
                        }
                        const privateKey = await fetchPrivKey()
                        const encryptedSymmetricKey = encryptedKeyData.data.encryptedKey
                        const message = msg_details.content
                        const { encryptedMessage } = await encryptMessage(message, privateKey, encryptedSymmetricKey)
                        encryptedMessageDetails = { ...msg_details, content: encryptedMessage, keyVersionId: roomData.room?.chatKeyVersion }
                    }

                } catch (error) {
                    console.log("There was an error grabbing public keys", error)
                }
                try {
                    const response = await fetch(`${PATH}/messages/createChatMessage`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ msg_details: encryptedMessageDetails })
                    })

                    if (!response.ok) {
                        throw new Error("Error with response")
                    }
                    const data = await response.json()
                } catch (error) {
                    console.error("error creating message", error)
                }
            }
            createMessage(msg_details)

        }
    };
    // Initialize the socket connectiond
    useEffect(() => {
        const fetchChatInfo = async () => {
            try {
                const response = await fetch(`${PATH}/chat/getChatInfo?chatId=${chunks[chunks.length - 1]}`);
                if (!response.ok) throw new Error("Error with chatInfo response");
                const data = await response.json();
                setRoomData({ room: data.data });
            } catch (error) {
                console.error(error);
            }
        };
        const fetchPrivKey = async () => {
            const privateKey = await retrievePrivateKey(user!.uid)
            return privateKey
        }

        const fetchMessages = async () => {
            try {
                const response = await fetch(`${PATH}/messages/getChatMessages?chatId=${chunks[chunks.length - 1]}&userId=${user?.uid}`);
                if (!response.ok) throw new Error("Error with message response");
                const data = await response.json();
                const privateKey: any = await fetchPrivKey()
                let encryptedMessages = data.data.messages
                const keys = data.data.keys
                const decrypted_messages = await decryptMessage(encryptedMessages, privateKey, keys)
                const messages = encryptedMessages.map((message: messageInfo, index: number) => ({
                    ...message, content: decrypted_messages[index].decryptedContent
                }))
                console.log(messages)
                setMessages({ messages });
                setLoadingMessages(false);
            } catch (error) {
                console.error(error);
            }
        };
        if (!init && user) {
            fetchChatInfo()
            fetchMessages()
            setInit(true)
        }
        if (user) {
            socketRef.current?.on("RECEIVED_MSG", (data: messageInfo) => {
                if (data.userId != user.uid) {
                    console.log("MESSAGE IS BEING CALLED")
                    setMessages((old) => ({
                        messages: [data, ...(old.messages ?? [])],
                    }));
                }
            });
        }


    }, [user]);

    useEffect(() => {
        if (!user || !socketRef.current || !roomData.room) return;
        socketRef.current?.emit("join_room", user, roomData);

        socketRef.current?.on("USER_ADDED", (data) => {
            console.log("Users in room:", data);
        });

        // Cleanup
        return () => {
            socketRef.current?.off("USER_ADDED");
        };
    }, [socketRef, isConnected, user, roomData.room]);

    return (
        <div className="flex w-full items-center justify-center">

            <div className="flex h-[calc(100vh-80px)] w-4/5">
                {(!loadingMessages) ? (
                    <Card className="flex flex-col w-full">
                        <CardHeader className="flex-none">
                            <CardTitle>
                                <ChatHeader roomName={roomData.room?.name ?? ""} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col-reverse overflow-y-auto p-4">
                            <ChatBody messages={messages.messages ?? []} currentUserId={user?.uid} />
                        </CardContent>
                        <CardFooter className="flex-none space-y-4">
                            <ChatInput form={form} onSubmit={onSubmit} />
                        </CardFooter>
                    </Card>
                ) : (
                    <div className="flex justify-center items-center w-full h-full">
                        <HashLoader color={"#61A653"} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chat