/**
 * LocalStorage to IndexedDB Migration Service
 */

import { dbGet, dbPut, dbPutMany, STORES, isIndexedDBAvailable } from "./db";

const MIGRATION_FLAG_KEY = "hasMigratedLocalStorage_v1";

export async function migrateFromLocalStorageIfNeeded(): Promise<{
  migrated: boolean;
  solutionsCount: number;
  error?: string;
}> {
  if (!isIndexedDBAvailable() || typeof window === "undefined" || !window.localStorage) {
    return { migrated: false, solutionsCount: 0 };
  }

  try {
    const metaRecord = await dbGet<{ key: string; value: boolean }>(
      STORES.META,
      MIGRATION_FLAG_KEY
    );
    if (metaRecord && metaRecord.value === true) {
      return { migrated: false, solutionsCount: 0 };
    }

    let solutionsCount = 0;
    const solutionsToMigrate: Array<{
      id: string;
      taskId: string;
      fileIdx: number;
      code: string;
      updatedAt: number;
    }> = [];
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("playground_js_code_")) {
        const id = key.replace(/^playground_js_code_/, "");
        const code = localStorage.getItem(key);
        if (typeof code === "string") {
          solutionsToMigrate.push({
            id,
            taskId: id.replace(/^(cand_|sol_)/, "").replace(/_file_\d+$/, ""),
            fileIdx: 0,
            code,
            updatedAt: Date.now(),
          });
          keysToRemove.push(key);
          solutionsCount++;
        }
      }
    }

    if (solutionsToMigrate.length > 0) {
      await dbPutMany(STORES.SOLUTIONS, solutionsToMigrate);
    }

    const completedTasksRaw = localStorage.getItem("playground_completed_tasks");
    if (completedTasksRaw) {
      try {
        const parsed = JSON.parse(completedTasksRaw);
        if (parsed && typeof parsed === "object") {
          const progressItems = Object.entries(parsed)
            .filter(([_, status]) => Boolean(status))
            .map(([taskId, status]) => ({
              taskId: String(taskId),
              status: status as string | boolean,
              updatedAt: Date.now(),
            }));
          if (progressItems.length > 0) {
            await dbPutMany(STORES.PROGRESS, progressItems);
          }
        }
      } catch (err) {
        console.warn("[Migration] Could not parse playground_completed_tasks:", err);
      }
    }

    const checklistRaw = localStorage.getItem("playground_checklist_state");
    if (checklistRaw) {
      try {
        const parsed = JSON.parse(checklistRaw);
        if (parsed && typeof parsed === "object") {
          const checklistItems = Object.entries(parsed)
            .filter(([_, checked]) => Boolean(checked))
            .map(([itemKey]) => ({
              itemKey: String(itemKey),
              checked: true,
              updatedAt: Date.now(),
            }));
          if (checklistItems.length > 0) {
            await dbPutMany(STORES.CHECKLIST, checklistItems);
          }
        }
      } catch (err) {
        console.warn("[Migration] Could not parse playground_checklist_state:", err);
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }

    await dbPut(STORES.META, {
      key: MIGRATION_FLAG_KEY,
      value: true,
      migratedAt: Date.now(),
      solutionsCount,
    });

    return { migrated: true, solutionsCount };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Storage Migration] Migration failed:", err);
    return { migrated: false, solutionsCount: 0, error: errorMsg };
  }
}
