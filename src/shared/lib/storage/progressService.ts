/**
 * Progress and Checklist Storage Service
 */

import { dbPut, dbDelete, dbGetAll, dbClear, dbPutMany, STORES } from "./db";

export type TaskStatus = "solved" | "unsolved" | boolean | null;

export interface ProgressRecord {
  taskId: string;
  status: string | boolean;
  updatedAt: number;
}

export interface ChecklistRecord {
  itemKey: string;
  checked: boolean;
  updatedAt: number;
}

const LOCAL_STORAGE_PROGRESS_KEY = "code_practice_progress_v2";

export interface CachedProgressRecord {
  status: TaskStatus;
  updatedAt: number;
}

export function getProgressFromLocalStorage(): Record<string, CachedProgressRecord> {
  if (typeof window === "undefined" || !window.localStorage) return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgressToLocalStorage(progress: Record<string, CachedProgressRecord>): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    if (!progress || Object.keys(progress).length === 0) {
      window.localStorage.removeItem(LOCAL_STORAGE_PROGRESS_KEY);
    } else {
      window.localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    }
  } catch {
    // ignore
  }
}

export interface CompletedTasksDBResult {
  tasks: Record<string, string | boolean>;
  timestamps: Record<string, number>;
}

export async function getCompletedTasksWithTimestampsFromDB(): Promise<CompletedTasksDBResult> {
  try {
    const records = await dbGetAll<ProgressRecord>(STORES.PROGRESS);
    const tasks: Record<string, string | boolean> = {};
    const timestamps: Record<string, number> = {};
    const localCache = getProgressFromLocalStorage();
    for (const record of records) {
      if (record && record.taskId && record.status) {
        tasks[record.taskId] = record.status;
        const ts = record.updatedAt || Date.now();
        timestamps[record.taskId] = ts;
        localCache[record.taskId] = { status: record.status as TaskStatus, updatedAt: ts };
      }
    }
    saveProgressToLocalStorage(localCache);
    return { tasks, timestamps };
  } catch (err) {
    console.error("[ProgressService] Failed to load completed tasks from DB:", err);
    return { tasks: {}, timestamps: {} };
  }
}

export async function getCompletedTasksFromDB(): Promise<Record<string, string | boolean>> {
  const result = await getCompletedTasksWithTimestampsFromDB();
  return result.tasks;
}

export async function saveTaskStatusToDB(
  taskId: string | number,
  status: TaskStatus,
  timestamp?: number
): Promise<void> {
  if (!taskId) return;
  const ts = timestamp ?? Date.now();
  const localCache = getProgressFromLocalStorage();
  if (!status) {
    delete localCache[String(taskId)];
  } else {
    localCache[String(taskId)] = { status, updatedAt: ts };
  }
  saveProgressToLocalStorage(localCache);

  try {
    if (!status) {
      await dbDelete(STORES.PROGRESS, String(taskId));
    } else {
      await dbPut(STORES.PROGRESS, {
        taskId: String(taskId),
        status,
        updatedAt: ts,
      });
    }
  } catch (err) {
    console.error(`[ProgressService] Error saving task status for ${taskId}:`, err);
  }
}

export async function saveAllCompletedTasksToDB(
  completedTasks: Record<string, string | boolean>,
  clearFirst = false,
  timestamps?: Record<string, number>
): Promise<void> {
  const localCache = clearFirst ? {} : getProgressFromLocalStorage();
  for (const [taskId, status] of Object.entries(completedTasks || {})) {
    if (status) {
      localCache[taskId] = {
        status: status as TaskStatus,
        updatedAt: timestamps?.[taskId] ?? Date.now(),
      };
    } else {
      delete localCache[taskId];
    }
  }
  saveProgressToLocalStorage(localCache);

  try {
    if (clearFirst) {
      await dbClear(STORES.PROGRESS);
    }
    const items = Object.entries(completedTasks || {})
      .filter(([_, status]) => Boolean(status))
      .map(([taskId, status]) => ({
        taskId: String(taskId),
        status,
        updatedAt: timestamps?.[taskId] ?? Date.now(),
      }));
    await dbPutMany(STORES.PROGRESS, items);
  } catch (err) {
    console.error("[ProgressService] Error batch saving completed tasks:", err);
  }
}

export async function removeTaskStatusesFromDB(taskIds: Array<string | number>): Promise<void> {
  if (!taskIds || taskIds.length === 0) return;
  const localCache = getProgressFromLocalStorage();
  for (const id of taskIds) {
    delete localCache[String(id)];
  }
  saveProgressToLocalStorage(localCache);

  try {
    for (const id of taskIds) {
      await dbDelete(STORES.PROGRESS, String(id));
    }
  } catch (err) {
    console.error("[ProgressService] Error removing task statuses:", err);
  }
}

export async function getChecklistStateFromDB(): Promise<Record<string, boolean>> {
  try {
    const records = await dbGetAll<ChecklistRecord>(STORES.CHECKLIST);
    const result: Record<string, boolean> = {};
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

export async function saveChecklistItemToDB(itemKey: string, checked: boolean): Promise<void> {
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

export async function saveAllChecklistToDB(
  checklistState: Record<string, boolean>,
  clearFirst = false
): Promise<void> {
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
