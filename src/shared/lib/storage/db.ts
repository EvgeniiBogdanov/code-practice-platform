/**
 * IndexedDB Database Service for Code Practice Platform
 */

export const DB_NAME = "code_practice_platform_db";
export const DB_VERSION = 3;

export const STORES = {
  SOLUTIONS: "solutions",
  PROGRESS: "progress",
  CHECKLIST: "checklist",
  META: "meta",
  REVIEWS: "reviews",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

let dbInstance: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

export function isIndexedDBAvailable(): boolean {
  try {
    return typeof window !== "undefined" && "indexedDB" in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        return await navigator.storage.persist();
      }
      return isPersisted;
    } catch {
      return false;
    }
  }
  return false;
}

export async function getStorageEstimate(): Promise<{
  usageMB: number;
  quotaMB: number;
  percentUsed: number;
}> {
  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
    try {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate();
      const usageMB = +(usage / (1024 * 1024)).toFixed(2);
      const quotaMB = +(quota / (1024 * 1024)).toFixed(2);
      const percentUsed = quota > 0 ? +((usage / quota) * 100).toFixed(2) : 0;
      return { usageMB, quotaMB, percentUsed };
    } catch {
      return { usageMB: 0, quotaMB: 0, percentUsed: 0 };
    }
  }
  return { usageMB: 0, quotaMB: 0, percentUsed: 0 };
}

function initObjectStores(db: IDBDatabase): void {
  if (!db.objectStoreNames.contains(STORES.SOLUTIONS)) {
    const sStore = db.createObjectStore(STORES.SOLUTIONS, { keyPath: "id" });
    sStore.createIndex("by_taskId", "taskId", { unique: false });
    sStore.createIndex("by_updatedAt", "updatedAt", { unique: false });
  }
  if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
    db.createObjectStore(STORES.PROGRESS, { keyPath: "taskId" });
  }
  if (!db.objectStoreNames.contains(STORES.CHECKLIST)) {
    db.createObjectStore(STORES.CHECKLIST, { keyPath: "itemKey" });
  }
  if (!db.objectStoreNames.contains(STORES.META)) {
    db.createObjectStore(STORES.META, { keyPath: "key" });
  }
  if (!db.objectStoreNames.contains(STORES.REVIEWS)) {
    const rStore = db.createObjectStore(STORES.REVIEWS, { keyPath: "taskId" });
    rStore.createIndex("by_nextReviewAt", "nextReviewAt", { unique: false });
    rStore.createIndex("by_updatedAt", "updatedAt", { unique: false });
  }
}

export function getDB(version: number = DB_VERSION): Promise<IDBDatabase> {
  if (dbInstance) {
    const hasAllStores = Object.values(STORES).every((s) =>
      dbInstance!.objectStoreNames.contains(s)
    );
    if (hasAllStores) return Promise.resolve(dbInstance);
    try {
      dbInstance.close();
    } catch {
      // ignore
    }
    dbInstance = null;
    dbPromise = null;
  }

  if (dbPromise) return dbPromise;

  if (!isIndexedDBAvailable()) {
    return Promise.reject(new Error("IndexedDB is not available."));
  }

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, version);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      initObjectStores(db);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const hasAllStores = Object.values(STORES).every((s) => db.objectStoreNames.contains(s));

      if (!hasAllStores) {
        const nextVersion = Math.max(version, db.version) + 1;
        try {
          db.close();
        } catch {
          // ignore
        }
        dbInstance = null;
        dbPromise = null;
        resolve(getDB(nextVersion));
        return;
      }

      dbInstance = db;
      dbInstance.onversionchange = () => {
        try {
          dbInstance?.close();
        } catch {
          // ignore
        }
        dbInstance = null;
        dbPromise = null;
      };

      resolve(dbInstance);
    };

    request.onerror = (event) => {
      dbPromise = null;
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

export async function dbGet<T = unknown>(storeName: string, key: IDBValidKey): Promise<T | null> {
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(storeName)) return null;
    return new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Error in dbGet(${storeName}, ${String(key)}):`, err);
    return null;
  }
}

export const withStorageLock = async <T>(operation: () => Promise<T>): Promise<T> => {
  if (
    typeof navigator !== "undefined" &&
    "locks" in navigator &&
    navigator.locks &&
    typeof navigator.locks.request === "function"
  ) {
    return navigator.locks.request("code_practice_platform_storage_lock", operation);
  }
  return operation();
};

export const dbPut = async <T extends object>(
  storeName: string,
  value: T
): Promise<IDBValidKey | null> => {
  return withStorageLock(async () => {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains(storeName)) return null;
      return new Promise<IDBValidKey>((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.put(value);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Error in dbPut(${storeName}):`, err);
      throw err;
    }
  });
};

export const dbDelete = async (storeName: string, key: IDBValidKey): Promise<void> => {
  return withStorageLock(async () => {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains(storeName)) return;
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Error in dbDelete(${storeName}, ${String(key)}):`, err);
      throw err;
    }
  });
};

export async function dbGetAll<T = unknown>(storeName: string): Promise<T[]> {
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(storeName)) return [];
    return new Promise<T[]>((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as T[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Error in dbGetAll(${storeName}):`, err);
    return [];
  }
}

export const dbClear = async (storeName: string): Promise<void> => {
  return withStorageLock(async () => {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains(storeName)) return;
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Error in dbClear(${storeName}):`, err);
      throw err;
    }
  });
};

export const dbPutMany = async <T extends object>(storeName: string, items: T[]): Promise<void> => {
  if (!items || items.length === 0) return;
  return withStorageLock(async () => {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains(storeName)) return;
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        for (const item of items) {
          store.put(item);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Error in dbPutMany(${storeName}):`, err);
      throw err;
    }
  });
};
