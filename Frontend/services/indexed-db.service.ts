import { Observable } from '../data/observable';

export interface ImportProgress {
    progress: Observable<any>;
    completed: Promise<void>;
}

declare global {
    interface IDBDatabase {
        add<T>(storeName: string, item: T, key: any): Promise<void>;
        delete<T>(storeName: string, key: any): Promise<void>;
        import<T>(storeName: string, data: T[], keySelector: (item: T) => any): ImportProgress;
        readStore<T>(storeName: string): Promise<T[]>;
        getKeys(storeName: string): Promise<any[]>;
        clearStore<T>(storeName: string): Promise<void>;
        countStore(storeName: string): Promise<number>;
        getItemByKey<T>(storeName: string, key: IDBKeyRange | IDBValidKey): Promise<T | null>;
        getStoreCursor(storeName: string): Observable<IDBCursorWithValue | null>;
    }
}

IDBDatabase.prototype.add = function <T>(this: IDBDatabase, storeName: string, item: T, key: any) {
    return new Promise<void>((resolve, reject) => {
        const transaction = this.transaction(storeName, 'readwrite');
        transaction.objectStore(storeName).add(item, key);
        transaction.commit();
        transaction.oncomplete = () => resolve();
        transaction.onabort = () => reject(transaction.error ?? new Error('the transaction was aborted'));
        transaction.onerror = () => reject(transaction.error ?? new Error('the transaction failed'));
    });
};

IDBDatabase.prototype.delete = function <T>(this: IDBDatabase, storeName: string, key: any) {
    return new Promise<void>((resolve, reject) => {
        const transaction = this.transaction(storeName, 'readwrite');
        transaction.objectStore(storeName).delete(key);
        transaction.commit();
        transaction.oncomplete = () => resolve();
        transaction.onabort = () => reject(transaction.error ?? new Error('the transaction was aborted'));
        transaction.onerror = () => reject(transaction.error ?? new Error('the transaction failed'));
    });
};

IDBDatabase.prototype.import = function <T>(
    this: IDBDatabase,
    storeName: string,
    data: T[],
    keySelector: (item: T) => any,
): ImportProgress {
    const progress = new Observable(null);
    const completed = new Promise<void>((resolve, reject) => {
        Promise.resolve().then(() => {
            try {
                const transaction = this.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const failed: string[] = [];

                for (const item of data) {
                    // put, not add + clear: upserting keeps entries the payload does not mention
                    const request = store.put(item, keySelector(item));
                    request.onsuccess = () => progress.next(null);
                    request.onerror = (event) => {
                        failed.push(`${keySelector(item)}: ${request.error}`);
                        // without preventDefault the request error propagates and aborts the
                        // whole transaction, losing every row that already succeeded
                        event.preventDefault();
                    };
                }
                transaction.commit();
                transaction.oncomplete = () => {
                    progress.finalize();
                    if (failed.length) reject(new Error(`${failed.length} of ${data.length} entries failed: ${failed[0]}`));
                    else resolve();
                };
                transaction.onabort = () => {
                    progress.finalize();
                    reject(transaction.error ?? new Error(`import into ${storeName} was aborted`));
                };
                transaction.onerror = () => {
                    progress.finalize();
                    reject(transaction.error ?? new Error(`import into ${storeName} failed`));
                };
            } catch (error) {
                progress.finalize();
                reject(error);
            }
        });
    });

    return { progress, completed };
};

IDBDatabase.prototype.getKeys = function (this: IDBDatabase, storeName: string) {
    return new Promise<any[]>((resolve, reject) => {
        const request = this.transaction(storeName, 'readonly').objectStore(storeName).getAllKeys();
        request.onsuccess = () => resolve(request.result as any[]);
        request.onerror = () => reject(request.error);
    });
};

IDBDatabase.prototype.readStore = function <T>(this: IDBDatabase, storeName: string) {
    return new Promise<T[]>((resolve, reject) => {
        const request = this.transaction(storeName, 'readonly').objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result as T[]);
        request.onerror = () => reject(request.error);
    });
};

IDBDatabase.prototype.getItemByKey = function <T>(this: IDBDatabase, storeName: string, key: IDBValidKey | IDBKeyRange) {
    return new Promise<T | null>((resolve, reject) => {
        const request = this.transaction(storeName, 'readonly').objectStore(storeName).get(key);
        request.onsuccess = () => resolve(request.result as T | null);
        request.onerror = () => reject(request.error);
    });
};

IDBDatabase.prototype.clearStore = function <T>(this: IDBDatabase, storeName: string) {
    return new Promise<void>((resolve, reject) => {
        const request = this.transaction(storeName, 'readwrite').objectStore(storeName).clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

IDBDatabase.prototype.countStore = function (this: IDBDatabase, storeName: string) {
    return new Promise<number>((resolve, reject) => {
        const request = this.transaction(storeName, 'readonly').objectStore(storeName).count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

IDBDatabase.prototype.getStoreCursor = function (this: IDBDatabase, storeName: string) {
    var observable = new Observable<IDBCursorWithValue | null>(null);
    const request = this.transaction(storeName, 'readonly').objectStore(storeName).openCursor();
    request.onsuccess = () => {
        if (!request.result) observable.finalize();
        else observable.next(request.result);
    };
    request.onerror = () => observable.finalize();

    return observable;
};

export class IndexedDbService {
    /**
     * Opens an existing database without ever creating one. indexedDB.databases() is not used:
     * WebKit only shipped it in Safari 14 and it is unreliable directly after a page load, and a
     * single empty answer used to discard a perfectly intact database.
     */
    static async openDatabase(dbName: string, dbVersion: number): Promise<IDBDatabase | null> {
        const database = await this.openExisting(dbName);
        if (!database) return null;

        if (database.objectStoreNames.length == 0 || database.version < dbVersion) {
            database.close();
            return null;
        }

        return database;
    }

    /** Opens the database, creating it and any missing object store, and resolves once usable. */
    static async createDatabase(dbName: string, dbVersion: number, ...storeNames: string[]): Promise<IDBDatabase> {
        const existing = await this.openExisting(dbName);
        const missing = existing ? storeNames.filter((name) => !existing.objectStoreNames.contains(name)) : storeNames;
        const currentVersion = existing?.version ?? 0;
        existing?.close();

        if (existing && missing.length == 0 && currentVersion >= dbVersion) {
            return (await this.openExisting(dbName))!;
        }

        const targetVersion = Math.max(dbVersion, currentVersion + (missing.length ? 1 : 0));
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, targetVersion);
            request.onerror = () => reject(request.error ?? new Error('database could not be opened'));
            request.onblocked = () => reject(new Error('another tab is holding the database open'));
            request.onupgradeneeded = () => {
                for (const storeName of storeNames)
                    if (!request.result.objectStoreNames.contains(storeName)) request.result.createObjectStore(storeName);
            };
            // resolve from onsuccess, not onupgradeneeded: inside onupgradeneeded the
            // versionchange transaction is still active and the first write would throw.
            request.onsuccess = () => resolve(request.result);
        });
    }

    static deleteDatabase(dbName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(dbName);
            request.onerror = () => reject(request.error ?? new Error('database could not be deleted'));
            request.onblocked = () => console.warn(`deleting ${dbName} is blocked by another connection, waiting`);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Opens the database at whatever version it has, or resolves null if it does not exist.
     * open() without a version creates an empty database when there is none, so the
     * versionchange transaction is aborted to roll that creation back - otherwise every probe
     * would leave a store-less stub behind and race with whoever creates the real schema.
     */
    private static openExisting(dbName: string): Promise<IDBDatabase | null> {
        return new Promise((resolve, reject) => {
            let didNotExist = false;
            const request = indexedDB.open(dbName);
            request.onupgradeneeded = () => {
                didNotExist = true;
                request.transaction?.abort();
            };
            request.onerror = (event) => {
                event.preventDefault();
                if (didNotExist) resolve(null);
                else reject(request.error ?? new Error('database could not be opened'));
            };
            request.onblocked = () => reject(new Error('another tab is holding the database open'));
            request.onsuccess = () => resolve(request.result);
        });
    }
}
