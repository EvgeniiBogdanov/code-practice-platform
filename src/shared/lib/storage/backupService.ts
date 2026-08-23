/**
 * Backup and Export / Import Storage Service
 */

import { getAllSolutions, clearAllSolutions, SolutionRecord } from "./solutionsService";
import {
  getCompletedTasksFromDB,
  getChecklistStateFromDB,
  saveAllCompletedTasksToDB,
  saveAllChecklistToDB,
} from "./progressService";
import { dbPutMany, STORES } from "./db";

const BACKUP_SCHEMA_VERSION = 1;

export interface BackupData {
  version: number;
  appName: string;
  exportedAt: string;
  stats: {
    solutionsCount: number;
    completedTasksCount: number;
    checklistCount: number;
  };
  data: {
    solutions: SolutionRecord[];
    progress: Record<string, string | boolean>;
    checklist: Record<string, boolean>;
  };
}

export async function createFullBackupData(): Promise<BackupData> {
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

export async function downloadBackupJson(filename?: string): Promise<void> {
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

export async function restoreBackupData(
  backupObject: unknown,
  options: { merge?: boolean } = { merge: true }
): Promise<{ success: boolean; importedSolutions: number; importedProgress: number }> {
  if (
    !backupObject ||
    typeof backupObject !== "object" ||
    !("data" in backupObject) ||
    !backupObject.data
  ) {
    throw new Error("Invalid backup format: missing 'data' root object.");
  }

  const { solutions = [], progress = {}, checklist = {} } = (backupObject as BackupData).data;

  if (!options.merge) {
    await clearAllSolutions();
  }

  if (Array.isArray(solutions) && solutions.length > 0) {
    const validSolutions = solutions.filter((s) => s && s.id && typeof s.code === "string");
    await dbPutMany(STORES.SOLUTIONS, validSolutions);
  }

  if (progress && typeof progress === "object") {
    await saveAllCompletedTasksToDB(progress, !options.merge);
  }

  if (checklist && typeof checklist === "object") {
    await saveAllChecklistToDB(checklist, !options.merge);
  }

  return {
    success: true,
    importedSolutions: Array.isArray(solutions) ? solutions.length : 0,
    importedProgress: Object.keys(progress).length,
  };
}

export async function restoreBackupFromFile(
  file: File,
  options: { merge?: boolean } = { merge: true }
): Promise<{ success: boolean; importedSolutions: number; importedProgress: number }> {
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
