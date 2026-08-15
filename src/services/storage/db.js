/**
 * IndexedDB Database Service for Code Practice Platform
 *
 * Provides a lightweight, Promise-based abstraction over window.indexedDB.
 * Handles database creation, migrations, transactions, and store operations.
 */

const DB_NAME = "code_practice_platform_db";
const DB_VERSION = 3;

export const STORES = {
  SOLUTIONS: "solutions",
  PROGRESS: "progress",
  CHECKLIST: "checklist",
  META: "meta",
  REVIEWS: "reviews",
};

let dbInstance = null;
let dbPromise = null;

/**
 * Checks if IndexedDB is available in the current browser environment.
 * @returns {boolean}
 */
export function isIndexedDBAvailable() {
  try {
    return typeof window !== "undefined" && "indexedDB" in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Requests durable storage from the browser (Storage Standard API).
 * Prevents the browser from evicting user solutions under low disk space.
 * @returns {Promise<boolean>}
 */
export async function requestPersistentStorage() {
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

/**
 * Returns estimated storage usage and quota in MB.
 * @returns {Promise<{ usageMB: number, quotaMB: number, percentUsed: number }>}
 */
export async function getStorageEstimate() {
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

/**
 * Opens and initializes the IndexedDB database.
 * Auto-detects missing stores and triggers dynamic schema upgrade if needed.
 * @param {number} [version=DB_VERSION]
 * @returns {Promise<IDBDatabase>}
 */
export function getDB(version = DB_VERSION) {
  // If we have a cached healthy instance with all stores, return it
  if (dbInstance) {
    const hasAllStores = Object.values(STORES).every(
      (s) => dbInstance.objectStoreNames.contains(s)
    );
    if (hasAllStores) {
      return Promise.resolve(dbInstance);
    }
    try {
      dbInstance.close();
    } catch {
      // ignore
    }
    dbInstance = null;
    dbPromise = null;
  }

  // If a connection promise is in-flight, return it
  if (dbPromise) {
    return dbPromise;
  }

  if (!isIndexedDBAvailable()) {
    return Promise.reject(new Error("IndexedDB is not supported or not available in this environment."));
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Store: solutions (user task code drafts and solutions)
      if (!db.objectStoreNames.contains(STORES.SOLUTIONS)) {
        const solutionsStore = db.createObjectStore(STORES.SOLUTIONS, { keyPath: "id" });
        solutionsStore.createIndex("by_taskId", "taskId", { unique: false });
        solutionsStore.createIndex("by_updatedAt", "updatedAt", { unique: false });
      }

      // 2. Store: progress (completed / unsolved task statuses)
      if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
        db.createObjectStore(STORES.PROGRESS, { keyPath: "taskId" });
      }

      // 3. Store: checklist (self-check items progress)
      if (!db.objectStoreNames.contains(STORES.CHECKLIST)) {
        db.createObjectStore(STORES.CHECKLIST, { keyPath: "itemKey" });
      }

      // 4. Store: meta (app metadata, migrations flag, settings)
      if (!db.objectStoreNames.contains(STORES.META)) {
        db.createObjectStore(STORES.META, { keyPath: "key" });
      }

      // 5. Store: reviews (spaced repetition review schedules and history)
      if (!db.objectStoreNames.contains(STORES.REVIEWS)) {
        const reviewsStore = db.createObjectStore(STORES.REVIEWS, { keyPath: "taskId" });
        reviewsStore.createIndex("by_nextReviewAt", "nextReviewAt", { unique: false });
        reviewsStore.createIndex("by_updatedAt", "updatedAt", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      // Verify all required stores exist
      const hasAllStores = Object.values(STORES).every(
        (s) => db.objectStoreNames.contains(s)
      );

      if (!hasAllStores) {
        // Missing a store (e.g. database was created in earlier version without upgrade).
        // Bump version number to force upgrade transaction.
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

      // Handle unexpected version change or closure
      dbInstance.onversionchange = () => {
        try {
          dbInstance.close();
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
      console.error("Failed to open IndexedDB:", event.target.error);
      reject(event.target.error);
    };

    request.onblocked = () => {
      console.warn("IndexedDB upgrade blocked by another open tab.");
    };
  });

  return dbPromise;
}

/**
 * Generic helper to get a single record by key from a store.
 * @param {string} storeName
 * @param {IDBValidKey} key
 * @returns {Promise<any>}
 */
export async function dbGet(storeName, key) {
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(storeName)) {
      return null;
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.get(key);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Error in dbGet(${storeName}, ${key}):`, err);
    return null;
  }
}

/**
 * Generic helper to put (insert or update) a record in a store.
 * @param {string} storeName
 * @param {object} value
 * @returns {Promise<IDBValidKey>}
 */
export async function dbPut(storeName, value) {
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(storeName)) {
      console.warn(`[IndexedDB] Object store ${storeName} does not exist yet.`);
      return null;
    }
    return new Promise((resolve, reject) => {
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
}

/**
 * Generic helper to delete a record by key from a store.
 * @param {string} storeName
 * @param {IDBValidKey} key
 * @returns {Promise<void>}
 */
export async function dbDelete(storeName, key) {
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(storeName)) {
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.delete(key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Error in dbDelete(${storeName}, ${key}):`, err);
    throw err;
  }
}

/**
 * Generic helper to get all records from a store.
 * @param {string} storeName
 * @returns {Promise<any[]>}
 */
export async function dbGetAll(storeName) {
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(storeName)) {
      return [];
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`[IndexedDB] Error in dbGetAll(${storeName}):`, err);
    return [];
  }
}

/**
 * Generic helper to clear all records from a store.
 * @param {string} storeName
 * @returns {Promise<void>}
 */
export async function dbClear(storeName) {
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(storeName)) {
      return;
    }
    return new Promise((resolve, reject) => {
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
}

/**
 * Performs a batch write (put multiple items) in a single transaction.
 * @param {string} storeName
 * @param {object[]} items
 * @returns {Promise<void>}
 */
export async function dbPutMany(storeName, items) {
  if (!items || items.length === 0) return;
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(storeName)) {
      console.warn(`[IndexedDB] Object store ${storeName} does not exist yet.`);
      return;
    }
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
}
