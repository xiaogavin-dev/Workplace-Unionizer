import { createSymmetricKey, encryptSymmetricKeys } from "./encryptionCalls"

interface roomInfoType {
    createdAt: string | null;
    id: string | null;
    name: string | null;
    chatKeyVersion: string | null,
    isPublic: boolean,
    isDefault: boolean,
    unionId: string | null;
    updatedAt: string | null;
}
export const handleNewChatMember = async (chat: roomInfoType | null, userId = null) => {
    // when someone new joins a chat we need to create a new key 
    const { symmetric_key } = await createSymmetricKey()
    //before we can encrypt this new symmetric_key we need to get everyone's public key from chat_users
    const publicKeysResponse = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/chat/getPublicKeys?chatId=${chat?.id}`)
    if (!publicKeysResponse.ok) { throw new Error("THere was an error with getting the public keys") }
    const publicKeyData = await publicKeysResponse.json()
    const publicKeys = publicKeyData.data
    const encryptedKeys = await encryptSymmetricKeys(symmetric_key, publicKeys)
    // const encryptSymmetricKeys{}
    const chatId = chat?.id
    const payload = { newRoomInfo: null, userKeyData: null }
    try {
        console.log("STORING NEW ENCRYPTED KEYS ")
        const response = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/chat/storeEncryptedKeys`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ chatId, encryptedKeys })
        })
        if (!response.ok) {
            throw new Error("There was an error with response to store keys")
        }
        const data = await response.json()
        payload.newRoomInfo = data.data
    } catch (error) {
        console.log(error, 'could not store symmetric key')
    }
    try {
        if (userId) {
            // grab the encrypted key
            const response = await fetch(`http://localhost:5000/chat/getEncryptedKey?userId=${userId}&chatKeyVersion=${payload.newRoomInfo?.chatKeyVersion}`)
            if (!response.ok) {
                throw new Error("There was an error with grabbing users encrypted key")
            }
            const encryptedKeyData = await response.json()
            payload.userKeyData = encryptedKeyData;
        }
    } catch (error) {
        console.log(error, 'Could not grab users key')
    }
    return payload;
}
export const handleMemberJoin = async (unionId: string | undefined, userId: string) => {
    try {
        //get all chats that are public in this specific union
        let unionPublicChats: Array<roomInfoType> = []
        try {
            const getChatResponse = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/union/getUnionPublicChats?unionId=${unionId}`)
            if (!getChatResponse.ok) { throw new Error("The getChatResponse was not okay") }
            const chatResponseData = await getChatResponse.json()
            unionPublicChats = chatResponseData.data
        } catch (error) {
            console.log('There was an error with getting public chats', error)
        }
        for (const chat of unionPublicChats) {
            try {
                await handleNewChatMember(chat)
            } catch (error) {
                console.log(`There was an error updating keys for ${chat.name}`)
            }
        }
    } catch (error) {
        console.log('There was an error handling join keys')
    }
}