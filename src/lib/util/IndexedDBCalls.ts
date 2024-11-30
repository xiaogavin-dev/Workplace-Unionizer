
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
export async function storePrivateKey(privateKey: string) {
    const db = await openDatabase();
    const transaction = db.transaction("keys", "readwrite");
    const store = transaction.objectStore("keys");

    return new Promise((resolve, reject) => {
        const request = store.put({ id: "user-private-key", key: privateKey });

        request.onsuccess = () => resolve("Private key stored successfully.");
        request.onerror = (event) => reject(event.target.error);
    });
}

export async function retrievePrivateKey() {
    const db = await openDatabase();
    const transaction = db.transaction("keys", "readonly");
    const store = transaction.objectStore("keys");

    return new Promise((resolve, reject) => {
        const request = store.get("user-private-key");

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

