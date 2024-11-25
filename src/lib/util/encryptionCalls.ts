import crypto from 'crypto';
import { storePrivateKey } from './IndexedDBCalls'
// Generate RSA Key Pair
export const generateKeyPair = async () => {
    try {
        const response = await fetch("http://127.0.0.1:5000/generate-rsa-key-pair")
        if (!response.ok) {
            throw new Error("Response was not okay")
        }
        const { publicKey, privateKey } = await response.json();

        // Store the private key in IndexedDB
        await storePrivateKey(privateKey);

        console.log('Public Key:', publicKey);

        return { publicKey, privateKey };
    } catch (error) {
        console.log(error)
    }
};
export const encryptSymmetricKeys = async (symmetric_key: string, public_keys: string[]) => {
    try {
        const response = await fetch("http://127.0.0.1:5000/encrypt-symmetric",
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
        const response = await fetch("http://127.0.0.1:5000/create-symmetric-key")
        if (!response.ok) {
            throw new Error("Response was not okay")
        }
        const data = await response.json()
        console.log(data)
        return data
    }
    catch (e) {
        console.log("There was an issue encrypting message")
    }
}


export const encryptMessage = async (message, public_keys) => {
    console.log(message)
    console.log(public_keys)
    try {
        const response = await fetch("http://127.0.0.1:5000/encrypt",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message, public_keys })
            }
        )
        if (!response.ok) {
            throw new Error("Response was not okay")
        }
        const data = await response.json()
        console.log(data)
        return data
    }
    catch (e) {
        console.log("There was an issue encrypting message")
    }
}

// module.exports = { encryptMessage }