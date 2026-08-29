/**
 * IndexedDB Database Service for Code Practice Platform
 * Resilient schema management with dynamic version discovery & multi-tab coordination.
 */

export const DB_NAME = "code_practice_platform_db";
export const DB_VERSION = 4;

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
  if (typeof navigator !== "undefined" && navigator.storage?.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      return isPersisted || (await navigator.storage.persist());
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
  if (typeof navigator !== "undefined" && navigator.storage?.estimate) {
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

const hasAllStores = (db: IDBDatabase): boolean =>
  Object.values(STORES).every((s) => db.objectStoreNames.contains(s));

const resetDbCache = (): void => {
  try {
    dbInstance?.close();
  } catch {
    // ignore
  }
  dbInstance = null;
  dbPromise = null;
};

const attachLifecycle = (db: IDBDatabase): void => {
  dbInstance = db;
  db.onversionchange = resetDbCache;
  db.onclose = resetDbCache;
};

const openWithVersion = (version: number): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = window.indexedDB.open(DB_NAME, version);
    req.onupgradeneeded = (e) => initObjectStores((e.target as IDBOpenDBRequest).result);
    req.onsuccess = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!hasAllStores(db)) {
        db.close();
        resolve(openWithVersion(db.version + 1));
        return;
      }
      attachLifecycle(db);
      resolve(db);
    };
    req.onblocked = () => console.warn("[IndexedDB] Database upgrade blocked by another tab.");
    req.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
  });

const openWithoutVersion = (): Promise<IDBDatabase | null> =>
  new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(DB_NAME);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onupgradeneeded = () => {
        req.transaction?.abort();
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });

async function openResilientDB(targetVersion: number = DB_VERSION): Promise<IDBDatabase> {
  if (!isIndexedDBAvailable()) throw new Error("IndexedDB is not available.");

  const existingDb = await openWithoutVersion();
  if (existingDb) {
    if (hasAllStores(existingDb) && existingDb.version >= targetVersion) {
      attachLifecycle(existingDb);
      return existingDb;
    }
    const nextVer = Math.max(existingDb.version + 1, targetVersion);
    existingDb.close();
    return openWithVersion(nextVer);
  }

  try {
    return await openWithVersion(targetVersion);
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "VersionError") {
      const fallbackDb = await openWithoutVersion();
      if (fallbackDb) {
        if (hasAllStores(fallbackDb)) {
          attachLifecycle(fallbackDb);
          return fallbackDb;
        }
        const nextVer = fallbackDb.version + 1;
        fallbackDb.close();
        return openWithVersion(nextVer);
      }
    }
    throw err;
  }
}

export function getDB(version: number = DB_VERSION): Promise<IDBDatabase> {
  if (dbInstance && hasAllStores(dbInstance)) {
    return Promise.resolve(dbInstance);
  }
  if (dbInstance) {
    resetDbCache();
  }

  if (!dbPromise) {
    dbPromise = openResilientDB(version).catch((err) => {
      resetDbCache();
      throw err;
    });
  }

  return dbPromise;
}

export const withStorageLock = async <T>(operation: () => Promise<T>): Promise<T> => {
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    return navigator.locks.request("code_practice_platform_storage_lock", operation);
  }
  return operation();
};

export async function dbGet<T = unknown>(storeName: string, key: IDBValidKey): Promise<T | null> {
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(storeName)) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Error in dbGet(${storeName}, ${String(key)}):`, err);
    return null;
  }
}

export const dbPut = async <T extends object>(
  storeName: string,
  value: T
): Promise<IDBValidKey | null> =>
  withStorageLock(async () => {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains(storeName)) return null;
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const req = tx.objectStore(storeName).put(value);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Error in dbPut(${storeName}):`, err);
      throw err;
    }
  });

export const dbDelete = async (storeName: string, key: IDBValidKey): Promise<void> =>
  withStorageLock(async () => {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains(storeName)) return;
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const req = tx.objectStore(storeName).delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Error in dbDelete(${storeName}, ${String(key)}):`, err);
      throw err;
    }
  });

export async function dbGetAll<T = unknown>(storeName: string): Promise<T[]> {
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(storeName)) return [];
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve((req.result as T[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Error in dbGetAll(${storeName}):`, err);
    return [];
  }
}

export const dbClear = async (storeName: string): Promise<void> =>
  withStorageLock(async () => {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains(storeName)) return;
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const req = tx.objectStore(storeName).clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Error in dbClear(${storeName}):`, err);
      throw err;
    }
  });

export const dbPutMany = async <T extends object>(storeName: string, items: T[]): Promise<void> => {
  if (!items || items.length === 0) return;
  return withStorageLock(async () => {
    try {
      const db = await getDB();
      if (!db.objectStoreNames.contains(storeName)) return;
      return new Promise((resolve, reject) => {
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
