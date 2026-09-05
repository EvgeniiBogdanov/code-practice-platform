/**
 * Solutions Storage Service
 *
 * Handles persistent storage of user task solutions and drafts in IndexedDB.
 */

import { dbGet, dbPut, dbDelete, dbGetAll, dbClear, STORES } from "./db";
import { parseIdMetadata, shouldResetDueSolution } from "./solutionHelpers";

export { parseIdMetadata, shouldResetDueSolution };

export interface SolutionRecord {
  id: string;
  taskId: string;
  fileIdx: number;
  code: string;
  updatedAt: number;
}

const memoryCache = new Map<string, string>();
const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();
const pendingWrites = new Map<string, SolutionRecord>();

const MAX_MEMORY_CACHE_ENTRIES = 150;

function setMemoryCache(id: string, code: string): void {
  if (memoryCache.has(id)) {
    memoryCache.delete(id);
  }
  memoryCache.set(id, code);

  if (memoryCache.size > MAX_MEMORY_CACHE_ENTRIES) {
    const oldestKey = memoryCache.keys().next().value;
    if (oldestKey) {
      // Guarantee no data loss: flush pending write to IndexedDB immediately before evicting from memory
      const pending = pendingWrites.get(oldestKey);
      if (pending) {
        pendingWrites.delete(oldestKey);
        if (pendingTimers.has(oldestKey)) {
          clearTimeout(pendingTimers.get(oldestKey)!);
          pendingTimers.delete(oldestKey);
        }
        dbPut(STORES.SOLUTIONS, pending).catch((err) => {
          console.error("[SolutionsService] Error persisting evicted solution:", err);
        });
      }
      memoryCache.delete(oldestKey);
    }
  }
}

const DEBOUNCE_DELAY_MS = 300;

export async function flushPendingSaves(): Promise<void> {
  if (pendingWrites.size === 0) return;

  const entriesToSave = Array.from(pendingWrites.values());
  pendingWrites.clear();

  for (const timer of pendingTimers.values()) {
    clearTimeout(timer);
  }
  pendingTimers.clear();

  for (const record of entriesToSave) {
    try {
      await dbPut(STORES.SOLUTIONS, record);
    } catch (err) {
      console.error("[SolutionsService] Failed to flush save for", record.id, err);
    }
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushPendingSaves();
    }
  });
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    flushPendingSaves();
  });
}

export function peekCachedSolution(id: string): string | null {
  if (!id) return null;
  if (memoryCache.has(id)) {
    const meta = pendingWrites.get(id);
    if (shouldResetDueSolution(id, meta?.updatedAt)) {
      memoryCache.delete(id);
      pendingWrites.delete(id);
      dbDelete(STORES.SOLUTIONS, id).catch(() => {});
      return null;
    }
    const val = memoryCache.get(id) || null;
    if (val !== null) {
      memoryCache.delete(id);
      memoryCache.set(id, val);
    }
    return val;
  }
  return null;
}

export async function getSolution(
  id: string,
  fallbackCode: string | null = null
): Promise<string | null> {
  if (!id) return fallbackCode;

  if (memoryCache.has(id)) {
    const meta = pendingWrites.get(id);
    if (shouldResetDueSolution(id, meta?.updatedAt)) {
      memoryCache.delete(id);
      pendingWrites.delete(id);
      try {
        await dbDelete(STORES.SOLUTIONS, id);
      } catch (err) {
        console.error("[SolutionsService] Error clearing due solution:", id, err);
      }
      return fallbackCode;
    }
    const val = memoryCache.get(id) || fallbackCode;
    if (val !== null) {
      memoryCache.delete(id);
      memoryCache.set(id, val);
    }
    return val;
  }

  try {
    const record = await dbGet<SolutionRecord>(STORES.SOLUTIONS, id);
    if (record && typeof record.code === "string") {
      if (shouldResetDueSolution(id, record.updatedAt)) {
        await dbDelete(STORES.SOLUTIONS, id);
        return fallbackCode;
      }
      setMemoryCache(id, record.code);
      return record.code;
    }
  } catch (err) {
    console.error("[SolutionsService] Error loading solution:", id, err);
  }

  return fallbackCode;
}

export async function saveSolution(
  id: string,
  code: string,
  meta: { taskId?: string; fileIdx?: number } = {}
): Promise<void> {
  if (!id || typeof code !== "string") return;

  setMemoryCache(id, code);

  if (pendingTimers.has(id)) {
    clearTimeout(pendingTimers.get(id)!);
    pendingTimers.delete(id);
  }
  pendingWrites.delete(id);

  const { taskId, fileIdx } = parseIdMetadata(id);
  const record: SolutionRecord = {
    id,
    taskId: meta.taskId || taskId,
    fileIdx: meta.fileIdx !== undefined ? meta.fileIdx : fileIdx,
    code,
    updatedAt: Date.now(),
  };

  try {
    await dbPut(STORES.SOLUTIONS, record);
  } catch (err) {
    console.error("[SolutionsService] Error saving solution:", id, err);
  }
}

export function saveSolutionDebounced(
  id: string,
  code: string,
  meta: { taskId?: string; fileIdx?: number } = {}
): void {
  if (!id || typeof code !== "string") return;

  setMemoryCache(id, code);

  const { taskId, fileIdx } = parseIdMetadata(id);
  const record: SolutionRecord = {
    id,
    taskId: meta.taskId || taskId,
    fileIdx: meta.fileIdx !== undefined ? meta.fileIdx : fileIdx,
    code,
    updatedAt: Date.now(),
  };
  pendingWrites.set(id, record);

  if (pendingTimers.has(id)) {
    clearTimeout(pendingTimers.get(id)!);
  }

  const timerId = setTimeout(async () => {
    pendingTimers.delete(id);
    const data = pendingWrites.get(id);
    if (data) {
      pendingWrites.delete(id);
      try {
        await dbPut(STORES.SOLUTIONS, data);
      } catch (err) {
        console.error("[SolutionsService] Debounced save failed:", id, err);
      }
    }
  }, DEBOUNCE_DELAY_MS);

  pendingTimers.set(id, timerId);
}

export async function deleteSolution(id: string): Promise<void> {
  if (!id) return;

  memoryCache.delete(id);

  if (pendingTimers.has(id)) {
    clearTimeout(pendingTimers.get(id)!);
    pendingTimers.delete(id);
  }
  pendingWrites.delete(id);

  try {
    await dbDelete(STORES.SOLUTIONS, id);
  } catch (err) {
    console.error("[SolutionsService] Error deleting solution:", id, err);
  }
}

export async function getAllSolutions(): Promise<SolutionRecord[]> {
  await flushPendingSaves();
  try {
    return await dbGetAll<SolutionRecord>(STORES.SOLUTIONS);
  } catch (err) {
    console.error("[SolutionsService] Error getting all solutions:", err);
    return [];
  }
}

export async function deleteSolutionsForTasks(taskIds: Array<string | number>): Promise<void> {
  if (!taskIds || taskIds.length === 0) return;
  const idSet = new Set(taskIds.map(String));

  for (const key of Array.from(memoryCache.keys())) {
    const { taskId, rootTaskId } = parseIdMetadata(key);
    if (idSet.has(String(taskId)) || idSet.has(String(rootTaskId)) || idSet.has(key)) {
      memoryCache.delete(key);
      if (pendingTimers.has(key)) {
        clearTimeout(pendingTimers.get(key)!);
        pendingTimers.delete(key);
      }
      pendingWrites.delete(key);
    }
  }

  try {
    const allRecords = await dbGetAll<SolutionRecord>(STORES.SOLUTIONS);
    for (const record of allRecords) {
      if (record) {
        const { taskId, rootTaskId } = parseIdMetadata(record.id);
        if (
          idSet.has(String(record.taskId)) ||
          idSet.has(String(taskId)) ||
          idSet.has(String(rootTaskId)) ||
          idSet.has(String(record.id))
        ) {
          await dbDelete(STORES.SOLUTIONS, record.id);
        }
      }
    }
  } catch (err) {
    console.error("[SolutionsService] Error deleting solutions for tasks:", err);
  }
}

export async function clearAllSolutions(): Promise<void> {
  memoryCache.clear();
  pendingWrites.clear();
  for (const timer of pendingTimers.values()) {
    clearTimeout(timer);
  }
  pendingTimers.clear();

  try {
    await dbClear(STORES.SOLUTIONS);
  } catch (err) {
    console.error("[SolutionsService] Error clearing solutions:", err);
  }
}

export function buildSolutionKey(
  taskId: string | number,
  prefix: "cand" | "sol" = "cand",
  fileIdx = 0,
  variantIdx = 0
): string {
  const variantPart = variantIdx > 0 ? `_${variantIdx}` : "";
  const filePart = fileIdx > 0 ? `_file_${fileIdx}` : "";
  return `${prefix}_${taskId}${variantPart}${filePart}`;
}

let isCacheInitialized = false;

export async function initSolutionsCache(): Promise<void> {
  if (isCacheInitialized) return;
  isCacheInitialized = true;

  try {
    const allRecords = await dbGetAll<SolutionRecord>(STORES.SOLUTIONS);
    allRecords.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    const recentRecords = allRecords.slice(0, 100);
    for (const record of recentRecords) {
      if (record && record.id && typeof record.code === "string") {
        if (!memoryCache.has(record.id)) {
          setMemoryCache(record.id, record.code);
        }
      }
    }
  } catch (err) {
    console.error("[SolutionsService] Error initializing solutions cache:", err);
  }
}

export function getUserSolutionSync(
  taskId: string | number,
  prefix: "cand" | "sol" = "cand",
  fileIdx = 0,
  variantIdx = 0,
  fallbackCode: string | null = null
): string | null {
  const key = buildSolutionKey(taskId, prefix, fileIdx, variantIdx);
  const cached = peekCachedSolution(key);
  return cached !== null ? cached : fallbackCode;
}

export async function getUserSolution(
  taskId: string | number,
  prefix: "cand" | "sol" = "cand",
  fileIdx = 0,
  variantIdx = 0,
  fallbackCode: string | null = null
): Promise<string | null> {
  const key = buildSolutionKey(taskId, prefix, fileIdx, variantIdx);
  return getSolution(key, fallbackCode);
}

export function saveUserSolution(
  taskId: string | number,
  prefix: "cand" | "sol" = "cand",
  fileIdx = 0,
  code = "",
  variantIdx = 0
): void {
  const key = buildSolutionKey(taskId, prefix, fileIdx, variantIdx);
  saveSolutionDebounced(key, code, { taskId: String(taskId), fileIdx });
}

export async function deleteUserSolution(
  taskId: string | number,
  prefix: "cand" | "sol" = "cand",
  fileIdx = 0,
  variantIdx = 0
): Promise<void> {
  const key = buildSolutionKey(taskId, prefix, fileIdx, variantIdx);
  await deleteSolution(key);
}
