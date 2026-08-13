/**
 * Solutions Service
 *
 * Handles persistent storage of user task solutions and drafts in IndexedDB.
 * Features:
 * - L1 in-memory cache for 0ms synchronous reads after first load
 * - Debounced auto-save to avoid disk I/O thrashing on every keystroke
 * - Immediate flush on page visibility change or unload
 */

import { dbGet, dbPut, dbDelete, dbGetAll, dbClear, STORES } from "./db";

// L1 Memory Cache: id -> code string
const memoryCache = new Map();

// Pending debounce timers: id -> timerId
const pendingTimers = new Map();

// Pending data to write: id -> { id, taskId, fileIdx, code, updatedAt }
const pendingWrites = new Map();

const DEBOUNCE_DELAY_MS = 300;

/**
 * Flush all pending debounced saves to IndexedDB immediately.
 * Useful before page unload or component unmount.
 * @returns {Promise<void>}
 */
export async function flushPendingSaves() {
  if (pendingWrites.size === 0) return;

  const entriesToSave = Array.from(pendingWrites.values());
  pendingWrites.clear();

  // Clear timers
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

// Auto flush on page unload or backgrounding
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushPendingSaves();
    }
  });

  window.addEventListener("beforeunload", () => {
    flushPendingSaves();
  });
}

/**
 * Parses taskId and fileIdx from standard composite ID.
 * Format examples: "cand_algo-01_file_0", "sol_js-05_0_file_1", or custom string.
 * @param {string} id
 * @returns {{ taskId: string, rootTaskId: string, fileIdx: number }}
 */
function parseIdMetadata(id) {
  if (!id) return { taskId: "", rootTaskId: "", fileIdx: 0 };
  
  const fileMatch = id.match(/_file_(\d+)$/);
  const fileIdx = fileMatch ? parseInt(fileMatch[1], 10) : 0;
  
  let taskId = id;
  if (fileMatch) {
    taskId = id.slice(0, fileMatch.index);
  }
  
  // Strip 'cand_' or 'sol_' prefixes for clean querying if needed
  taskId = taskId.replace(/^(cand_|sol_)/, "");

  // If there is a variant suffix like "1_0" or "js-01_1", extract root taskId as well
  const variantMatch = taskId.match(/^(.+)_(\d+)$/);
  const rootTaskId = variantMatch ? variantMatch[1] : taskId;

  return { taskId, rootTaskId, fileIdx };
}

/**
 * Synchronously peeks at the L1 in-memory cache.
 * Returns null if not cached yet.
 * @param {string} id
 * @returns {string | null}
 */
export function peekCachedSolution(id) {
  if (!id) return null;
  return memoryCache.has(id) ? memoryCache.get(id) : null;
}

/**
 * Gets a user's saved solution code by ID from memory cache or IndexedDB.
 * @param {string} id - Unique identifier (e.g. `cand_${taskId}_file_${fileIdx}`)
 * @param {string} [fallbackCode=null] - Default code if nothing is saved
 * @returns {Promise<string | null>}
 */
export async function getSolution(id, fallbackCode = null) {
  if (!id) return fallbackCode;

  // 1. Check L1 Memory Cache
  if (memoryCache.has(id)) {
    return memoryCache.get(id);
  }

  // 2. Check IndexedDB
  try {
    const record = await dbGet(STORES.SOLUTIONS, id);
    if (record && typeof record.code === "string") {
      memoryCache.set(id, record.code);
      return record.code;
    }
  } catch (err) {
    console.error("[SolutionsService] Error loading solution:", id, err);
  }

  return fallbackCode;
}

/**
 * Immediately saves a user's solution to memory cache and IndexedDB.
 * @param {string} id
 * @param {string} code
 * @param {object} [meta={}]
 * @returns {Promise<void>}
 */
export async function saveSolution(id, code, meta = {}) {
  if (!id || typeof code !== "string") return;

  // Update memory cache immediately
  memoryCache.set(id, code);

  // Clear any existing debounce timer for this id
  if (pendingTimers.has(id)) {
    clearTimeout(pendingTimers.get(id));
    pendingTimers.delete(id);
  }
  pendingWrites.delete(id);

  const { taskId, fileIdx } = parseIdMetadata(id);
  const record = {
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

/**
 * Debounced save for continuous typing in code editor.
 * Updates L1 memory cache instantly and batches IndexedDB writes.
 * @param {string} id
 * @param {string} code
 * @param {object} [meta={}]
 */
export function saveSolutionDebounced(id, code, meta = {}) {
  if (!id || typeof code !== "string") return;

  // 1. Memory cache updated synchronously (0ms latency for React / fast switches)
  memoryCache.set(id, code);

  // 2. Prepare pending record
  const { taskId, fileIdx } = parseIdMetadata(id);
  const record = {
    id,
    taskId: meta.taskId || taskId,
    fileIdx: meta.fileIdx !== undefined ? meta.fileIdx : fileIdx,
    code,
    updatedAt: Date.now(),
  };
  pendingWrites.set(id, record);

  // 3. Reset debounce timer
  if (pendingTimers.has(id)) {
    clearTimeout(pendingTimers.get(id));
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

/**
 * Deletes a user's solution by ID (Reset code functionality).
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteSolution(id) {
  if (!id) return;

  memoryCache.delete(id);

  if (pendingTimers.has(id)) {
    clearTimeout(pendingTimers.get(id));
    pendingTimers.delete(id);
  }
  pendingWrites.delete(id);

  try {
    await dbDelete(STORES.SOLUTIONS, id);
  } catch (err) {
    console.error("[SolutionsService] Error deleting solution:", id, err);
  }
}

/**
 * Retrieves all saved solutions.
 * @returns {Promise<Array<{ id: string, taskId: string, fileIdx: number, code: string, updatedAt: number }>>}
 */
export async function getAllSolutions() {
  await flushPendingSaves();
  try {
    return await dbGetAll(STORES.SOLUTIONS);
  } catch (err) {
    console.error("[SolutionsService] Error getting all solutions:", err);
    return [];
  }
}

/**
 * Deletes solutions for a specified list of task IDs (e.g. for a specific section).
 * @param {string[]} taskIds
 * @returns {Promise<void>}
 */
export async function deleteSolutionsForTasks(taskIds) {
  if (!taskIds || taskIds.length === 0) return;
  const idSet = new Set(taskIds.map(String));

  // 1. Clear matching keys from memoryCache and pending saves
  for (const key of Array.from(memoryCache.keys())) {
    const { taskId, rootTaskId } = parseIdMetadata(key);
    if (idSet.has(String(taskId)) || idSet.has(String(rootTaskId)) || idSet.has(key)) {
      memoryCache.delete(key);
      if (pendingTimers.has(key)) {
        clearTimeout(pendingTimers.get(key));
        pendingTimers.delete(key);
      }
      pendingWrites.delete(key);
    }
  }

  // 2. Query all records from IndexedDB and delete matching ones
  try {
    const allRecords = await dbGetAll(STORES.SOLUTIONS);
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

/**
 * Clears all user solutions from storage and memory.
 * @returns {Promise<void>}
 */
export async function clearAllSolutions() {
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
