/**
 * Backup and Export / Import Service
 *
 * Allows users to export all their solutions, progress, and checklist data
 * to a single JSON backup file, and restore it on another machine or browser.
 */

import { getAllSolutions, clearAllSolutions } from "./solutionsService";
import {
  getCompletedTasksFromDB,
  getChecklistStateFromDB,
  saveAllCompletedTasksToDB,
  saveAllChecklistToDB,
} from "./progressService";
import { dbPutMany, STORES } from "./db";

const BACKUP_SCHEMA_VERSION = 1;

/**
 * Creates a complete JSON-serializable snapshot of all user data.
 * @returns {Promise<object>}
 */
export async function createFullBackupData() {
  const [solutions, progress, checklist] = await Promise.all([
    getAllSolutions(),
    getCompletedTasksFromDB(),
    getChecklistStateFromDB(),
  ]);

  return {
    version: BACKUP_SCHEMA_VERSION,
    appName: "CodePracticePlatform",
    exportedAt: new Date().toISOString(),
    stats: {
      solutionsCount: solutions.length,
      completedTasksCount: Object.keys(progress).length,
      checklistCount: Object.keys(checklist).length,
    },
    data: {
      solutions,
      progress,
      checklist,
    },
  };
}

/**
 * Downloads a backup of the user's data as a .json file.
 * @param {string} [filename]
 * @returns {Promise<void>}
 */
export async function downloadBackupJson(filename) {
  const backup = await createFullBackupData();
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().slice(0, 10);
  const actualName = filename || `code-practice-backup-${dateStr}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = actualName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Restores user data from a backup object.
 * @param {object} backupObject
 * @param {{ merge?: boolean }} options - If merge is false, existing solutions are replaced.
 * @returns {Promise<{ success: boolean, importedSolutions: number, importedProgress: number }>}
 */
export async function restoreBackupData(backupObject, options = { merge: true }) {
  if (!backupObject || typeof backupObject !== "object" || !backupObject.data) {
    throw new Error("Invalid backup format: missing 'data' root object.");
  }

  const { solutions = [], progress = {}, checklist = {} } = backupObject.data;

  if (!options.merge) {
    await clearAllSolutions();
  }

  // 1. Restore solutions
  if (Array.isArray(solutions) && solutions.length > 0) {
    const validSolutions = solutions.filter((s) => s && s.id && typeof s.code === "string");
    await dbPutMany(STORES.SOLUTIONS, validSolutions);
  }

  // 2. Restore task progress
  if (progress && typeof progress === "object") {
    await saveAllCompletedTasksToDB(progress, !options.merge);
  }

  // 3. Restore checklist
  if (checklist && typeof checklist === "object") {
    await saveAllChecklistToDB(checklist, !options.merge);
  }

  return {
    success: true,
    importedSolutions: Array.isArray(solutions) ? solutions.length : 0,
    importedProgress: Object.keys(progress).length,
  };
}

/**
 * Reads a JSON File object from an <input type="file"> and restores it.
 * @param {File} file
 * @param {{ merge?: boolean }} options
 * @returns {Promise<{ success: boolean, importedSolutions: number, importedProgress: number }>}
 */
export async function restoreBackupFromFile(file, options = { merge: true }) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") {
          throw new Error("Failed to read file contents.");
        }
        const json = JSON.parse(text);
        const result = await restoreBackupData(json, options);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
}
