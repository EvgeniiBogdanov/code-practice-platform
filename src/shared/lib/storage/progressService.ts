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

export async function getCompletedTasksFromDB(): Promise<Record<string, string | boolean>> {
  try {
    const records = await dbGetAll<ProgressRecord>(STORES.PROGRESS);
    const result: Record<string, string | boolean> = {};
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

export async function saveTaskStatusToDB(
  taskId: string | number,
  status: TaskStatus
): Promise<void> {
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

export async function saveAllCompletedTasksToDB(
  completedTasks: Record<string, string | boolean>,
  clearFirst = false
): Promise<void> {
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

export async function removeTaskStatusesFromDB(taskIds: Array<string | number>): Promise<void> {
  if (!taskIds || taskIds.length === 0) return;
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
