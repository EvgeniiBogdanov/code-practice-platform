import { create } from "zustand";
import {
  migrateFromLocalStorageIfNeeded,
  getCompletedTasksFromDB,
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
  checklistState: {},
  copiedCodeId: null,
  isInitialized: false,

  initProgress: async (): Promise<void> => {
    if (get().isInitialized) return;

    requestPersistentStorage();
    await migrateFromLocalStorageIfNeeded();

    const [tasks, checklist] = await Promise.all([
      getCompletedTasksFromDB(),
      getChecklistStateFromDB(),
    ]);

    set({
      completedTasks: (tasks as unknown as Record<string, TaskCompletionStatus>) || {},
      checklistState: checklist || {},
      isInitialized: true,
    });

    subscribeToSyncEvents((event) => {
      if (event.type === "TASK_STATUS_CHANGED" && event.taskId) {
        set((state) => {
          const updated = { ...state.completedTasks };
          if (!event.status) {
            delete updated[String(event.taskId)];
          } else {
            updated[String(event.taskId)] = event.status as TaskCompletionStatus;
          }
          return { completedTasks: updated };
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
            for (const [id, status] of Object.entries(state.completedTasks)) {
              if (!idsSet.has(String(id))) {
                updated[id] = status;
              }
            }
            return { completedTasks: updated };
          });
        }
      }
    });
  },

  setTaskStatus: async (taskId: string | number, status: TaskCompletionStatus): Promise<void> => {
    const stringId = String(taskId);
    set((state) => {
      const updated = { ...state.completedTasks };
      if (!status) {
        delete updated[stringId];
      } else {
        updated[stringId] = status;
      }
      return { completedTasks: updated };
    });

    await saveTaskStatusToDB(stringId, status);
    broadcastSyncEvent("TASK_STATUS_CHANGED", { taskId: stringId, status });
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
      set({ completedTasks: {} });
      broadcastSyncEvent("PROGRESS_RESET", { idsToRemove: allIds });
    } else if (taskIds.length > 0) {
      const stringIds = taskIds.map(String);
      await deleteSolutionsForTasks(stringIds);
      broadcastSyncEvent("SOLUTIONS_CLEARED", { taskIds: stringIds });

      await removeTaskStatusesFromDB(stringIds);
      const idsToRemove = new Set(stringIds);
      set((state) => {
        const updated: Record<string, TaskCompletionStatus> = {};
        for (const [id, status] of Object.entries(state.completedTasks)) {
          if (!idsToRemove.has(String(id))) {
            updated[id] = status;
          }
        }
        return { completedTasks: updated };
      });
      broadcastSyncEvent("PROGRESS_RESET", { idsToRemove: stringIds });
    }
  },
}));
