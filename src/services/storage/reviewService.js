/**
 * Spaced Repetition Review Storage Service
 *
 * Handles persistent storage of task review schedules, SM-2 intervals,
 * and review history using a robust dual-storage strategy:
 * 1. Primary durable store: IndexedDB (STORES.REVIEWS)
 * 2. Instant synchronous cache: LocalStorage (0ms initial hydration)
 */

import { dbGet, dbPut, dbDelete, dbGetAll, dbClear, dbPutMany, STORES } from "./db.js";

const LOCAL_STORAGE_REVIEWS_KEY = "code_practice_reviews_v1";

/**
 * Synchronously retrieves reviews cache from LocalStorage for instant hydration.
 * @returns {Record<string, object>}
 */
export function getReviewsFromLocalStorage() {
  if (typeof window === "undefined" || !window.localStorage) return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.warn("[ReviewService] Failed to read reviews from localStorage:", err);
    return {};
  }
}

/**
 * Synchronously writes reviews cache to LocalStorage.
 * @param {Record<string, object>} reviews
 */
export function saveReviewsToLocalStorage(reviews) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    if (!reviews || Object.keys(reviews).length === 0) {
      window.localStorage.removeItem(LOCAL_STORAGE_REVIEWS_KEY);
    } else {
      window.localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
    }
  } catch (err) {
    console.warn("[ReviewService] Failed to write reviews to localStorage:", err);
  }
}

/**
 * Loads all task reviews from IndexedDB, reconciling with LocalStorage cache.
 * @returns {Promise<Record<string, object>>}
 */
export async function getAllReviewsFromDB() {
  const localCache = getReviewsFromLocalStorage();

  try {
    const records = await dbGetAll(STORES.REVIEWS);
    const result = {};

    for (const record of records) {
      if (record && record.taskId) {
        result[String(record.taskId)] = record;
      }
    }

    // If IndexedDB has records, update local cache and return
    if (Object.keys(result).length > 0) {
      saveReviewsToLocalStorage(result);
      return result;
    }

    // If IndexedDB was empty but localCache has reviews, migrate cache into IndexedDB
    if (Object.keys(localCache).length > 0) {
      const itemsToPersist = Object.values(localCache).map((item) => ({
        ...item,
        taskId: String(item.taskId),
        updatedAt: item.updatedAt || Date.now(),
      }));
      await dbPutMany(STORES.REVIEWS, itemsToPersist);
      return localCache;
    }

    return {};
  } catch (err) {
    console.error("[ReviewService] Failed to load reviews from DB, using fallback cache:", err);
    return localCache;
  }
}

/**
 * Gets a review record for a specific task.
 * @param {string | number} taskId
 * @returns {Promise<object | null>}
 */
export async function getReviewFromDB(taskId) {
  if (!taskId) return null;
  const stringId = String(taskId);
  try {
    const fromDB = await dbGet(STORES.REVIEWS, stringId);
    if (fromDB) return fromDB;
  } catch (err) {
    console.error(`[ReviewService] Error getting review for ${taskId}:`, err);
  }

  const localCache = getReviewsFromLocalStorage();
  return localCache[stringId] || null;
}

/**
 * Saves or updates a task review record in IndexedDB and LocalStorage cache.
 * @param {string | number} taskId
 * @param {object} reviewData
 * @returns {Promise<void>}
 */
export async function saveReviewToDB(taskId, reviewData) {
  if (!taskId || !reviewData) return;
  const stringId = String(taskId);
  const record = {
    ...reviewData,
    taskId: stringId,
    updatedAt: Date.now(),
  };

  // 1. Update synchronous LocalStorage cache immediately
  const localCache = getReviewsFromLocalStorage();
  localCache[stringId] = record;
  saveReviewsToLocalStorage(localCache);

  // 2. Persist to IndexedDB
  try {
    await dbPut(STORES.REVIEWS, record);
  } catch (err) {
    console.error(`[ReviewService] Error saving review for ${taskId} to IndexedDB:`, err);
  }
}

/**
 * Deletes a review record from IndexedDB and LocalStorage cache.
 * @param {string | number} taskId
 * @returns {Promise<void>}
 */
export async function deleteReviewFromDB(taskId) {
  if (!taskId) return;
  const stringId = String(taskId);

  // 1. Update synchronous LocalStorage cache immediately
  const localCache = getReviewsFromLocalStorage();
  delete localCache[stringId];
  saveReviewsToLocalStorage(localCache);

  // 2. Delete from IndexedDB
  try {
    await dbDelete(STORES.REVIEWS, stringId);
  } catch (err) {
    console.error(`[ReviewService] Error deleting review for ${taskId} from IndexedDB:`, err);
  }
}

/**
 * Deletes review records for a list of task IDs.
 * @param {Array<string | number>} taskIds
 * @returns {Promise<void>}
 */
export async function deleteReviewsForTasksFromDB(taskIds) {
  if (!taskIds || taskIds.length === 0) return;
  const stringIds = taskIds.map(String);

  // 1. Update LocalStorage cache
  const localCache = getReviewsFromLocalStorage();
  for (const id of stringIds) {
    delete localCache[id];
  }
  saveReviewsToLocalStorage(localCache);

  // 2. Delete from IndexedDB
  try {
    for (const id of stringIds) {
      await dbDelete(STORES.REVIEWS, id);
    }
  } catch (err) {
    console.error("[ReviewService] Error deleting reviews for task list from IndexedDB:", err);
  }
}

/**
 * Clears all review records from IndexedDB and LocalStorage.
 * @returns {Promise<void>}
 */
export async function clearAllReviewsFromDB() {
  // 1. Clear LocalStorage cache
  saveReviewsToLocalStorage({});

  // 2. Clear IndexedDB
  try {
    await dbClear(STORES.REVIEWS);
  } catch (err) {
    console.error("[ReviewService] Error clearing all reviews from DB:", err);
  }
}
