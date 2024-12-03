
export const openDatabase = async () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("KeyStore", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target?.result;
            if (!db.objectStoreNames.contains("keys")) {
                db.createObjectStore("keys", { keyPath: "id" });
            }
        };

        request.onsuccess = (event) => resolve(event.target?.result);
        request.onerror = (event) => reject(event.target?.error);
    });
}
export async function storePrivateKey(userId: string, privateKey: string) {
    const db = await openDatabase();
    const transaction = db.transaction("keys", "readwrite");
    const store = transaction.objectStore("keys");

    return new Promise((resolve, reject) => {
        const request = store.put({ id: `private-key-${userId}`, key: privateKey });

        request.onsuccess = () => resolve(`Private key stored successfully for user ${userId}.`);
        request.onerror = (event) => reject(event.target.error);
    });
}

export async function retrievePrivateKey(userId: string) {
    const db = await openDatabase();
    const transaction = db.transaction("keys", "readonly");
    const store = transaction.objectStore("keys");

    return new Promise((resolve, reject) => {
        const request = store.get(`private-key-${userId}`);

        request.onsuccess = (event) => {
            const result = event.target.result;
            if (result) {
                resolve(result.key); // Return the private key
            } else {
                reject(new Error(`No private key found for user ${userId}.`));
            }
        };
        request.onerror = (event) => reject(event.target.error);
    });
}

