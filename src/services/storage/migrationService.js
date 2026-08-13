/**
 * LocalStorage to IndexedDB Migration Service
 *
 * Automatically migrates existing user data (code drafts, completed task status, checklist)
 * from localStorage into IndexedDB on first load, and frees localStorage quota.
 */

import { dbGet, dbPut, dbPutMany, STORES, isIndexedDBAvailable } from "./db";

const MIGRATION_FLAG_KEY = "hasMigratedLocalStorage_v1";

/**
 * Runs one-time migration from localStorage to IndexedDB if not already performed.
 * @returns {Promise<{ migrated: boolean, solutionsCount: number, error?: string }>}
 */
export async function migrateFromLocalStorageIfNeeded() {
  if (!isIndexedDBAvailable() || typeof window === "undefined" || !window.localStorage) {
    return { migrated: false, solutionsCount: 0 };
  }

  try {
    // Check if migration was already recorded in IndexedDB
    const metaRecord = await dbGet(STORES.META, MIGRATION_FLAG_KEY);
    if (metaRecord && metaRecord.value === true) {
      return { migrated: false, solutionsCount: 0 };
    }

    let solutionsCount = 0;
    const solutionsToMigrate = [];
    const keysToRemove = [];

    // 1. Scan localStorage for code solutions (playground_js_code_*)
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

    // Write all solutions to IndexedDB
    if (solutionsToMigrate.length > 0) {
      await dbPutMany(STORES.SOLUTIONS, solutionsToMigrate);
    }

    // 2. Migrate completed tasks
    const completedTasksRaw = localStorage.getItem("playground_completed_tasks");
    if (completedTasksRaw) {
      try {
        const parsed = JSON.parse(completedTasksRaw);
        if (parsed && typeof parsed === "object") {
          const progressItems = Object.entries(parsed)
            .filter(([_, status]) => Boolean(status))
            .map(([taskId, status]) => ({
              taskId: String(taskId),
              status,
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

    // 3. Migrate checklist state
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

    // Clean up code keys from localStorage to reclaim 5MB quota
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }

    // Mark migration as complete
    await dbPut(STORES.META, {
      key: MIGRATION_FLAG_KEY,
      value: true,
      migratedAt: Date.now(),
      solutionsCount,
    });

    if (solutionsCount > 0) {
      console.info(`[Storage Migration] Successfully migrated ${solutionsCount} solutions from localStorage to IndexedDB.`);
    }

    return { migrated: true, solutionsCount };
  } catch (err) {
    console.error("[Storage Migration] Migration failed:", err);
    return { migrated: false, solutionsCount: 0, error: err.message };
  }
}
