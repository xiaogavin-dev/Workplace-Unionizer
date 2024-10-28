"use client";
import { FC, useRef, useState, useEffect } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import { userType } from "../../lib/redux/features/auth/authSlice";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatHeader, ChatBody, ChatInput } from "./chatHeader";
import { io, Socket } from "socket.io-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppSelector } from "@/lib/redux/hooks/redux";
import Rooms from "./rooms";

const PATH = "http://localhost:5000";

interface chatProps { }

const FormSchema = z.object({
    message: z.string(),
});

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}
interface messageType {
    message: string[]
}
export interface RoomType {
    room: string | null;
    socketId: string | null
}

const chatRoomsTest: Array<RoomType> = [
    { room: "general chat 1", socketId: null },
    { room: "general chat 2", socketId: null },
];

const sentMessagesSeed: messageType = {
    message: [
        "hello, how are you doing",
        "I've been good"
    ]
}
const receivedMessagesSeed: messageType = {
    message: [
        "Hey, I'm doing alright, hbu?",
        "thats nice to hear"
    ]
}

const socket = io(PATH, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});
const Chat: FC<chatProps> = ({ }) => {
    const { isAuthenticated, isLoading, user } = useAppSelector(
        (state): { isAuthenticated: boolean; isLoading: boolean; user: userType | null } => state.auth
    );

    const socketRef = useRef<Socket | null>(null);
    const [receivedMessage, setReceivedMessage] = useState<string>("");
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [roomData, setRoomData] = useState<RoomType>({ room: null, socketId: null });
    const [chatRooms, setChatRooms] = useState<Array<RoomType>>(chatRoomsTest);
    const [sentMessages, setSentMessages] = useState<messageType>(sentMessagesSeed);
    const [receivedMessages, setReceivedMessages] = useState<messageType>(receivedMessagesSeed);

    const selectRoom = (item: RoomType) => {
        setRoomData(item);
        if (socketRef.current?.connected) {
            socketRef.current.emit("join_room", item)
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        console.log(socketRef.current)
        if (socketRef.current?.connected) {
            const msg_details = { msg: data.message, receiver: roomData };
            console.log(data.message);
            setSentMessages((old: messageType) => ({
                ...old,
                message: old.message
            }))
            socketRef.current.emit("SEND_MSG", data.message, roomData);
        }
    };

    // Initialize the socket connectiond
    useEffect(() => {
        // if (!socketRef.current || !socketRef.current.connected) {
        socketRef.current = socket
        console.log()
        socketRef.current.on("connect", () => {
            console.log("Socket connected");
            setIsConnected(true);
        });

        socketRef.current.on("RECEIVED_MSG", (data) => {
            console.log("Message received:", data);
            setReceivedMessage(data.message);
        });
        // }


    }, []);

    useEffect(() => {
        console.log(user)
        if (user && isConnected && socketRef.current && roomData.room) {
            socketRef.current.emit("join_room", user, roomData);
            socketRef.current.on("USER_ADDED", (data) => {
                console.log("Users in room:", data);
            });
        }
    }, [isConnected, user, roomData]);

    return (
        <div className="flex grow">
            <Rooms chatRooms={chatRooms} selectRoom={selectRoom} />
            {user ?
                <Card className='h-screen flex flex-col w-full'>
                    <CardHeader className='flex-none' >
                        <CardTitle><ChatHeader roomName={roomData.room} /></CardTitle>
                        <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent className='flex-grow flex flex-col-reverse overflow-y overflow-y-auto p-4'>
                        <ChatBody sentMessages={sentMessages} receivedMessages={receivedMessages} />
                    </CardContent>
                    <CardFooter className='flex-none space-y-4'>
                        <ChatInput form={form} onSubmit={onSubmit} />
                    </CardFooter>
                </Card> :
                <PropagateLoader className='' />
            }

        </div>
    )
}

export default Chat