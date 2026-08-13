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
} from "../services/storage";
import {
  ALL_TASKS as allTasksList,
  ALL_REACT_TASKS,
  ALL_JS_TASKS,
  ALL_ALGO_TASKS,
} from "../data/tasksRegistry";

export const useProgressStore = create((set, get) => ({
  completedTasks: {},
  checklistState: {},
  copiedCodeId: null,
  isInitialized: false,

  /**
   * Initializes storage, requests persistent storage, runs migration,
   * loads data from IndexedDB and sets up cross-tab synchronization.
   */
  initProgress: async () => {
    if (get().isInitialized) return;

    requestPersistentStorage();
    await migrateFromLocalStorageIfNeeded();

    const [tasks, checklist] = await Promise.all([
      getCompletedTasksFromDB(),
      getChecklistStateFromDB(),
    ]);

    set({
      completedTasks: tasks || {},
      checklistState: checklist || {},
      isInitialized: true,
    });

    // Подписка на реалтайм события между вкладками
    subscribeToSyncEvents((event) => {
      if (event.type === "TASK_STATUS_CHANGED") {
        set((state) => {
          const updated = { ...state.completedTasks };
          if (!event.status) {
            delete updated[event.taskId];
          } else {
            updated[event.taskId] = event.status;
          }
          return { completedTasks: updated };
        });
      } else if (event.type === "CHECKLIST_CHANGED") {
        set((state) => ({
          checklistState: {
            ...state.checklistState,
            [event.key]: event.checked,
          },
        }));
      } else if (event.type === "PROGRESS_RESET") {
        if (event.idsToRemove && Array.isArray(event.idsToRemove)) {
          const idsSet = new Set(event.idsToRemove.map(String));
          set((state) => {
            const updated = {};
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

  setTaskStatus: async (taskId, status) => {
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

  toggleChecklistItem: async (key) => {
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

  handleCopyCode: (id, codeText) => {
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

  handleFullReset: async (scope = "section", activeSection = "javascript") => {
    if (scope === "all") {
      // 1. Очистка решений во всей IndexedDB и памяти
      await clearAllSolutions();
      broadcastSyncEvent("SOLUTIONS_CLEARED", { all: true });

      // 2. Очистка статусов всех задач
      const allIds = allTasksList.map((t) => String(t.id));
      await removeTaskStatusesFromDB(allIds);
      set({ completedTasks: {} });
      broadcastSyncEvent("PROGRESS_RESET", { idsToRemove: allIds });
    } else {
      const sectionTasks =
        activeSection === "javascript"
          ? ALL_JS_TASKS
          : activeSection === "algorithms"
          ? ALL_ALGO_TASKS
          : ALL_REACT_TASKS;
      const taskIds = sectionTasks.map((t) => String(t.id));

      // 1. Очистка решений раздела
      await deleteSolutionsForTasks(taskIds);
      broadcastSyncEvent("SOLUTIONS_CLEARED", { taskIds });

      // 2. Очистка статусов задач раздела
      await removeTaskStatusesFromDB(taskIds);
      const idsToRemove = new Set(taskIds);
      set((state) => {
        const updated = {};
        for (const [id, status] of Object.entries(state.completedTasks)) {
          if (!idsToRemove.has(String(id))) {
            updated[id] = status;
          }
        }
        return { completedTasks: updated };
      });
      broadcastSyncEvent("PROGRESS_RESET", { idsToRemove: taskIds });
    }
  },
}));
