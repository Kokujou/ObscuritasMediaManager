import { Observable } from '../data/observable';

declare global {
    interface IDBDatabase {
        import<T>(storeName: string, data: T[], keySelector: (item: T) => any): Observable<any>;
        readStore<T>(storeName: string): Promise<T[]>;
    }
}

IDBDatabase.prototype.import = function <T>(this: IDBDatabase, storeName: string, data: T[], keySelector: (item: T) => any) {
    const observable = new Observable(null);

    Promise.resolve().then(() => {
        const transaction = this.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        store.clear();

        for (var item of data) {
            const request = store.add(item, keySelector(item));
            request.onsuccess = () => observable.next(null);
            request.onerror = () => alert(`track could not be imported: ${keySelector(item)}. error: ${request.error}`);
        }
        transaction.commit();
        transaction.oncomplete = () => observable.finalize();
        transaction.onabort = () => observable.finalize();
        transaction.onerror = () => observable.finalize();
    });

    return observable;
};

IDBDatabase.prototype.readStore = function <T>(this: IDBDatabase, storeName: string) {
    return new Promise<T[]>((resolve, reject) => {
        const request = this.transaction(storeName, 'readonly').objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result as T[]);
        request.onerror = () => reject(request.error);
    });
};

export class IndexedDbService {
    static async openDatabase(dbName: string, dbVersion: number): Promise<IDBDatabase | null> {
        const databases = await indexedDB.databases();
        if (!databases.some((x) => x.name == dbName && x.version == dbVersion)) return null;

        return new Promise((resolve, reject) => {
            let request = indexedDB.open(dbName, dbVersion);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onblocked = () => reject('version changed');
        });
    }

    static async createDatabase(dbName: string, dbVersion: number, ...storeNames: string[]): Promise<IDBDatabase> {
        const databases = await indexedDB.databases();
        if (databases.some((x) => x.name == dbName && x.version == dbVersion)) throw new Error('Database already exists');

        return new Promise((resolve, reject) => {
            let request = indexedDB.open(dbName, dbVersion);
            request.onerror = () => reject(request.error);
            request.onblocked = () => reject('version changed');
            request.onupgradeneeded = () => {
                const database = request.result;
                for (var storeName of storeNames) database.createObjectStore(storeName);
                resolve(database);
            };
        });
    }

    static deleteDatabase(dbName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(dbName);
            request.onerror = () => reject(request.error);
            request.onblocked = () => reject('version changed');
            request.onsuccess = () => resolve();
        });
    }
}
