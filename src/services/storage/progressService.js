/**
 * Progress and Checklist Service
 *
 * Handles persistent storage of task completion statuses (solved/unsolved)
 * and self-check items in IndexedDB.
 */

import { dbGet, dbPut, dbDelete, dbGetAll, dbClear, dbPutMany, STORES } from "./db.js";

/**
 * Loads all completed task statuses as a dictionary: { [taskId]: 'solved' | 'unsolved' }.
 * @returns {Promise<Record<string, string>>}
 */
export async function getCompletedTasksFromDB() {
  try {
    const records = await dbGetAll(STORES.PROGRESS);
    const result = {};
    for (const record of records) {
      if (record && record.taskId && record.status) {
        result[record.taskId] = record.status;
      }
    }
    return result;
  } catch (err) {
    console.error("[ProgressService] Failed to load completed tasks from DB:", err);
    return {};
  }
}

/**
 * Saves or removes a single task status in IndexedDB.
 * @param {string} taskId
 * @param {'solved' | 'unsolved' | null} status
 * @returns {Promise<void>}
 */
export async function saveTaskStatusToDB(taskId, status) {
  if (!taskId) return;
  try {
    if (!status) {
      await dbDelete(STORES.PROGRESS, String(taskId));
    } else {
      await dbPut(STORES.PROGRESS, {
        taskId: String(taskId),
        status,
        updatedAt: Date.now(),
      });
    }
  } catch (err) {
    console.error(`[ProgressService] Error saving task status for ${taskId}:`, err);
  }
}

/**
 * Batch saves a full dictionary of completed tasks into IndexedDB.
 * @param {Record<string, string>} completedTasks
 * @param {boolean} [clearFirst=false]
 * @returns {Promise<void>}
 */
export async function saveAllCompletedTasksToDB(completedTasks, clearFirst = false) {
  try {
    if (clearFirst) {
      await dbClear(STORES.PROGRESS);
    }
    const items = Object.entries(completedTasks || {})
      .filter(([_, status]) => Boolean(status))
      .map(([taskId, status]) => ({
        taskId: String(taskId),
        status,
        updatedAt: Date.now(),
      }));
    await dbPutMany(STORES.PROGRESS, items);
  } catch (err) {
    console.error("[ProgressService] Error batch saving completed tasks:", err);
  }
}

/**
 * Deletes specific task statuses from IndexedDB (e.g. on reset progress).
 * @param {string[]} taskIds
 * @returns {Promise<void>}
 */
export async function removeTaskStatusesFromDB(taskIds) {
  if (!taskIds || taskIds.length === 0) return;
  try {
    for (const id of taskIds) {
      await dbDelete(STORES.PROGRESS, String(id));
    }
  } catch (err) {
    console.error("[ProgressService] Error removing task statuses:", err);
  }
}

/**
 * Loads all checklist state from IndexedDB as a dictionary: { [itemKey]: boolean }.
 * @returns {Promise<Record<string, boolean>>}
 */
export async function getChecklistStateFromDB() {
  try {
    const records = await dbGetAll(STORES.CHECKLIST);
    const result = {};
    for (const record of records) {
      if (record && record.itemKey) {
        result[record.itemKey] = Boolean(record.checked);
      }
    }
    return result;
  } catch (err) {
    console.error("[ProgressService] Failed to load checklist from DB:", err);
    return {};
  }
}

/**
 * Saves a single checklist item toggle in IndexedDB.
 * @param {string} itemKey
 * @param {boolean} checked
 * @returns {Promise<void>}
 */
export async function saveChecklistItemToDB(itemKey, checked) {
  if (!itemKey) return;
  try {
    if (!checked) {
      await dbDelete(STORES.CHECKLIST, String(itemKey));
    } else {
      await dbPut(STORES.CHECKLIST, {
        itemKey: String(itemKey),
        checked: true,
        updatedAt: Date.now(),
      });
    }
  } catch (err) {
    console.error(`[ProgressService] Error saving checklist item ${itemKey}:`, err);
  }
}

/**
 * Batch saves full checklist state.
 * @param {Record<string, boolean>} checklistState
 * @param {boolean} [clearFirst=false]
 * @returns {Promise<void>}
 */
export async function saveAllChecklistToDB(checklistState, clearFirst = false) {
  try {
    if (clearFirst) {
      await dbClear(STORES.CHECKLIST);
    }
    const items = Object.entries(checklistState || {})
      .filter(([_, checked]) => Boolean(checked))
      .map(([itemKey]) => ({
        itemKey: String(itemKey),
        checked: true,
        updatedAt: Date.now(),
      }));
    await dbPutMany(STORES.CHECKLIST, items);
  } catch (err) {
    console.error("[ProgressService] Error batch saving checklist:", err);
  }
}
