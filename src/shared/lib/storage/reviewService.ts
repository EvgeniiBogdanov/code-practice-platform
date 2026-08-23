/**
 * Spaced Repetition Review Storage Service
 */

import { dbGet, dbPut, dbDelete, dbGetAll, dbClear, dbPutMany, STORES } from "./db";

const LOCAL_STORAGE_REVIEWS_KEY = "code_practice_reviews_v1";

export interface ReviewRecord {
  taskId: string | number;
  stage: number;
  rating?: "easy" | "medium" | "hard";
  nextReviewAt: number;
  dueDate?: string;
  userTimezone?: string;
  lastReviewedDate?: string;
  lastReviewedAt?: number;
  intervalDays?: number;
  reviewCount?: number;
  updatedAt?: number;
  [key: string]: unknown;
}

export function getReviewsFromLocalStorage(): Record<string, ReviewRecord> {
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

export function saveReviewsToLocalStorage(reviews: Record<string, ReviewRecord>): void {
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

export async function getAllReviewsFromDB(): Promise<Record<string, ReviewRecord>> {
  const localCache = getReviewsFromLocalStorage();

  try {
    const records = await dbGetAll<ReviewRecord>(STORES.REVIEWS);
    const result: Record<string, ReviewRecord> = {};

    for (const record of records) {
      if (record && record.taskId) {
        result[String(record.taskId)] = record;
      }
    }

    if (Object.keys(result).length > 0) {
      saveReviewsToLocalStorage(result);
      return result;
    }

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

export async function getReviewFromDB(taskId: string | number): Promise<ReviewRecord | null> {
  if (!taskId) return null;
  const stringId = String(taskId);
  try {
    const fromDB = await dbGet<ReviewRecord>(STORES.REVIEWS, stringId);
    if (fromDB) return fromDB;
  } catch (err) {
    console.error(`[ReviewService] Error getting review for ${taskId}:`, err);
  }

  const localCache = getReviewsFromLocalStorage();
  return localCache[stringId] || null;
}

export async function saveReviewToDB(
  taskId: string | number,
  reviewData: Partial<ReviewRecord>
): Promise<void> {
  if (!taskId || !reviewData) return;
  const stringId = String(taskId);
  const record: ReviewRecord = {
    ...(reviewData as ReviewRecord),
    taskId: stringId,
    updatedAt: Date.now(),
  };

  const localCache = getReviewsFromLocalStorage();
  localCache[stringId] = record;
  saveReviewsToLocalStorage(localCache);

  try {
    await dbPut(STORES.REVIEWS, record);
  } catch (err) {
    console.error(`[ReviewService] Error saving review for ${taskId} to IndexedDB:`, err);
  }
}

export async function deleteReviewFromDB(taskId: string | number): Promise<void> {
  if (!taskId) return;
  const stringId = String(taskId);

  const localCache = getReviewsFromLocalStorage();
  delete localCache[stringId];
  saveReviewsToLocalStorage(localCache);

  try {
    await dbDelete(STORES.REVIEWS, stringId);
  } catch (err) {
    console.error(`[ReviewService] Error deleting review for ${taskId} from IndexedDB:`, err);
  }
}

export async function deleteReviewsForTasksFromDB(taskIds: Array<string | number>): Promise<void> {
  if (!taskIds || taskIds.length === 0) return;
  const stringIds = taskIds.map(String);

  const localCache = getReviewsFromLocalStorage();
  for (const id of stringIds) {
    delete localCache[id];
  }
  saveReviewsToLocalStorage(localCache);

  try {
    for (const id of stringIds) {
      await dbDelete(STORES.REVIEWS, id);
    }
  } catch (err) {
    console.error("[ReviewService] Error deleting reviews for task list from IndexedDB:", err);
  }
}

export async function clearAllReviewsFromDB(): Promise<void> {
  saveReviewsToLocalStorage({});
  try {
    await dbClear(STORES.REVIEWS);
  } catch (err) {
    console.error("[ReviewService] Error clearing all reviews from DB:", err);
  }
}
