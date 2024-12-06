import crypto from 'crypto';
import { storePrivateKey } from './IndexedDBCalls'
// Generate RSA Key Pair
export const generateKeyPair = async (userId: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENCRYPTION_PORT}/generate-rsa-key-pair`)
        if (!response.ok) {
            throw new Error("Response was not okay")
        }
        const { publicKey, privateKey } = await response.json();

        // Store the private key in IndexedDB
        await storePrivateKey(userId, privateKey);

        return { publicKey, privateKey };
    } catch (error) {
        console.log(error)
    }
};
export const encryptSymmetricKeys = async (symmetric_key: string, public_keys: string[]) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENCRYPTION_PORT}/encrypt-symmetric`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ symmetric_key, public_keys })
            }
        )
        if (!response.ok) {
            throw new Error("Response was not okay")
        }
        const data = await response.json()
        return data.encrypted_results
    }
    catch (e) {
        console.log("There was an issue encrypting message")
    }
}
export const createSymmetricKey = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENCRYPTION_PORT}/create-symmetric-key`)
        if (!response.ok) {
            throw new Error("Response was not okay")
        }
        const data = await response.json()
        return data
    }
    catch (e) {
        console.log("There was an issue encrypting message")
    }
}


export const encryptMessage = async (message, privateKey, encryptedSymmetricKey) => {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENCRYPTION_PORT}/encrypt-message`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message, privateKey, encryptedSymmetricKey })
            }
        )
        if (!response.ok) {
            throw new Error("Response was not okay")
        }
        const data = await response.json()
        return data
    }
    catch (e) {
        console.log("There was an issue encrypting message")
    }
}
export const decryptMessage = async (messages, privateKey, keys) => {
    try {
        console.log(process.env.NEXT_PUBLIC_ENCRYPTION_PORT)
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENCRYPTION_PORT}/decrypt-message`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ messages, privateKey, keys })
            }
        )
        if (!response.ok) {
            throw new Error("Response was not okay")
        }
        const data = await response.json()
        return data
    }
    catch (e) {
        console.log("There was an issue decrypting message")
    }
}

// module.exports = { encryptMessage }