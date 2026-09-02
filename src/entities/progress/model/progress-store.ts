import { create } from "zustand";
import {
  migrateFromLocalStorageIfNeeded,
  getCompletedTasksWithTimestampsFromDB,
  saveTaskStatusToDB,
  removeTaskStatusesFromDB,
  getChecklistStateFromDB,
  saveChecklistItemToDB,
  requestPersistentStorage,
  broadcastSyncEvent,
  subscribeToSyncEvents,
  clearAllSolutions,
  deleteSolutionsForTasks,
} from "@/shared/lib/storage";
import { ProgressState, TaskCompletionStatus } from "../types";

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedTasks: {},
  taskStatusTimestamps: {},
  checklistState: {},
  copiedCodeId: null,
  isInitialized: false,

  initProgress: async (): Promise<void> => {
    if (get().isInitialized) return;

    requestPersistentStorage();
    await migrateFromLocalStorageIfNeeded();

    const [{ tasks, timestamps }, checklist] = await Promise.all([
      getCompletedTasksWithTimestampsFromDB(),
      getChecklistStateFromDB(),
    ]);

    set({
      completedTasks: (tasks as unknown as Record<string, TaskCompletionStatus>) || {},
      taskStatusTimestamps: timestamps || {},
      checklistState: checklist || {},
      isInitialized: true,
    });

    subscribeToSyncEvents((event) => {
      if (event.type === "TASK_STATUS_CHANGED" && event.taskId) {
        set((state) => {
          const updated = { ...state.completedTasks };
          const updatedTimestamps = { ...state.taskStatusTimestamps };
          const id = String(event.taskId);
          if (!event.status) {
            delete updated[id];
            delete updatedTimestamps[id];
          } else {
            updated[id] = event.status as TaskCompletionStatus;
            updatedTimestamps[id] =
              typeof event.updatedAt === "number" ? event.updatedAt : Date.now();
          }
          return { completedTasks: updated, taskStatusTimestamps: updatedTimestamps };
        });
      } else if (event.type === "CHECKLIST_CHANGED" && event.key) {
        set((state) => ({
          checklistState: {
            ...state.checklistState,
            [String(event.key)]: Boolean(event.checked),
          },
        }));
      } else if (event.type === "PROGRESS_RESET") {
        if (event.idsToRemove && Array.isArray(event.idsToRemove)) {
          const idsSet = new Set(event.idsToRemove.map(String));
          set((state) => {
            const updated: Record<string, TaskCompletionStatus> = {};
            const updatedTimestamps: Record<string, number> = {};
            for (const [id, status] of Object.entries(state.completedTasks)) {
              if (!idsSet.has(String(id))) {
                updated[id] = status;
              }
            }
            for (const [id, ts] of Object.entries(state.taskStatusTimestamps)) {
              if (!idsSet.has(String(id))) {
                updatedTimestamps[id] = ts;
              }
            }
            return { completedTasks: updated, taskStatusTimestamps: updatedTimestamps };
          });
        }
      }
    });
  },

  setTaskStatus: async (taskId: string | number, status: TaskCompletionStatus): Promise<void> => {
    const stringId = String(taskId);
    const now = Date.now();
    set((state) => {
      const updated = { ...state.completedTasks };
      const updatedTimestamps = { ...state.taskStatusTimestamps };
      if (!status) {
        delete updated[stringId];
        delete updatedTimestamps[stringId];
      } else {
        updated[stringId] = status;
        updatedTimestamps[stringId] = now;
      }
      return { completedTasks: updated, taskStatusTimestamps: updatedTimestamps };
    });

    await saveTaskStatusToDB(stringId, status, now);
    broadcastSyncEvent("TASK_STATUS_CHANGED", { taskId: stringId, status, updatedAt: now });
  },

  toggleChecklistItem: async (key: string): Promise<void> => {
    const nextChecked = !get().checklistState[key];
    set((state) => ({
      checklistState: {
        ...state.checklistState,
        [key]: nextChecked,
      },
    }));

    await saveChecklistItemToDB(key, nextChecked);
    broadcastSyncEvent("CHECKLIST_CHANGED", { key, checked: nextChecked });
  },

  handleCopyCode: (id: string, codeText: string): void => {
    if (!codeText) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codeText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = codeText;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    } catch {
      // fallback
    }
    set({ copiedCodeId: id });
    setTimeout(() => {
      if (get().copiedCodeId === id) {
        set({ copiedCodeId: null });
      }
    }, 2000);
  },

  handleFullReset: async (
    scope = "section",
    taskIds: Array<string | number> = []
  ): Promise<void> => {
    if (scope === "all") {
      await clearAllSolutions();
      broadcastSyncEvent("SOLUTIONS_CLEARED", { all: true });

      const allIds = Object.keys(get().completedTasks);
      await removeTaskStatusesFromDB(allIds);
      set({ completedTasks: {}, taskStatusTimestamps: {} });
      broadcastSyncEvent("PROGRESS_RESET", { idsToRemove: allIds });
    } else if (taskIds.length > 0) {
      const stringIds = taskIds.map(String);
      await deleteSolutionsForTasks(stringIds);
      broadcastSyncEvent("SOLUTIONS_CLEARED", { taskIds: stringIds });

      await removeTaskStatusesFromDB(stringIds);
      const idsToRemove = new Set(stringIds);
      set((state) => {
        const updated: Record<string, TaskCompletionStatus> = {};
        const updatedTimestamps: Record<string, number> = {};
        for (const [id, status] of Object.entries(state.completedTasks)) {
          if (!idsToRemove.has(String(id))) {
            updated[id] = status;
          }
        }
        for (const [id, ts] of Object.entries(state.taskStatusTimestamps)) {
          if (!idsToRemove.has(String(id))) {
            updatedTimestamps[id] = ts;
          }
        }
        return { completedTasks: updated, taskStatusTimestamps: updatedTimestamps };
      });
      broadcastSyncEvent("PROGRESS_RESET", { idsToRemove: stringIds });
    }
  },
}));
