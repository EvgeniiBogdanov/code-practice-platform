import { create } from "zustand";
import {
  getAllReviewsFromDB,
  getReviewsFromLocalStorage,
  saveReviewToDB,
  deleteReviewFromDB,
  deleteReviewsForTasksFromDB,
  clearAllReviewsFromDB,
  getExcludedTasksFromDB,
  saveExcludedTasksToDB,
  getExcludedTasksFromLocalStorage,
  getAssistantNameFromDB,
  saveAssistantNameToDB,
  clearAssistantNameFromDB,
  getAssistantNameFromLocalStorage,
  DEFAULT_ASSISTANT_NAME,
  broadcastSyncEvent,
  subscribeToSyncEvents,
} from "@/shared/lib/storage";
import { ReviewState, ReviewRating, ReviewItem, MasteryStats, ReviewTaskItem } from "../types";
import { calculateNextReview, isTaskDue } from "./sm2-algorithm";

const initialReviews =
  (getReviewsFromLocalStorage() as unknown as Record<string, ReviewItem>) || {};
const initialExcluded = getExcludedTasksFromLocalStorage() || [];
const initialAssistantName = getAssistantNameFromLocalStorage() || DEFAULT_ASSISTANT_NAME;

let unsubscribeSyncEvents: (() => void) | null = null;

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: initialReviews,
  excludedTaskIds: initialExcluded,
  assistantName: initialAssistantName,
  isInitialized: true,

  initReviews: async (): Promise<void> => {
    try {
      const [records, excluded, name] = await Promise.all([
        getAllReviewsFromDB(),
        getExcludedTasksFromDB(),
        getAssistantNameFromDB(),
      ]);
      set({
        reviews: (records as unknown as Record<string, ReviewItem>) || {},
        excludedTaskIds: excluded || [],
        assistantName: name || DEFAULT_ASSISTANT_NAME,
        isInitialized: true,
      });

      if (unsubscribeSyncEvents) {
        unsubscribeSyncEvents();
        unsubscribeSyncEvents = null;
      }

      unsubscribeSyncEvents = subscribeToSyncEvents((event) => {
        if (event.type === "TASK_REVIEWED" && event.taskId && event.review) {
          set((state) => ({
            reviews: {
              ...state.reviews,
              [String(event.taskId)]: event.review as ReviewItem,
            },
          }));
        } else if (event.type === "TASK_REVIEW_DELETED" && event.taskId) {
          set((state) => {
            const updated = { ...state.reviews };
            delete updated[String(event.taskId)];
            return { reviews: updated };
          });
        } else if (event.type === "TASK_EXCLUSION_CHANGED" && Array.isArray(event.taskIds)) {
          set({ excludedTaskIds: event.taskIds });
        } else if (event.type === "ASSISTANT_NAME_CHANGED" && typeof event.name === "string") {
          set({ assistantName: event.name || DEFAULT_ASSISTANT_NAME });
        } else if (event.type === "REVIEWS_RESET") {
          if (event.all) {
            set({ reviews: {} });
          } else if (event.taskIds && Array.isArray(event.taskIds)) {
            const idsSet = new Set(event.taskIds.map(String));
            set((state) => {
              const updated: Record<string, ReviewItem> = {};
              for (const [id, rev] of Object.entries(state.reviews)) {
                if (!idsSet.has(String(id))) {
                  updated[id] = rev;
                }
              }
              return { reviews: updated };
            });
          }
        }
      });
    } catch {
      // Fallback to localStorage
    }
  },

  submitReview: async (taskId: string | number, rating: ReviewRating = "medium"): Promise<void> => {
    const stringId = String(taskId);
    const existing = get().reviews[stringId] || null;
    const item = calculateNextReview(existing, rating);
    item.taskId = stringId;

    set((state) => ({
      reviews: {
        ...state.reviews,
        [stringId]: item,
      },
    }));

    await saveReviewToDB(stringId, item as unknown as Record<string, unknown>);
    broadcastSyncEvent("TASK_REVIEWED", { taskId: stringId, review: item });
  },

  removeReview: async (taskId: string | number): Promise<void> => {
    const stringId = String(taskId);
    set((state) => {
      const updated = { ...state.reviews };
      delete updated[stringId];
      return { reviews: updated };
    });

    await deleteReviewFromDB(stringId);
    broadcastSyncEvent("TASK_REVIEWED", { taskId: stringId });
  },

  isTaskExcluded: (taskId: string | number): boolean => {
    return get().excludedTaskIds.includes(String(taskId));
  },

  toggleExcludeTask: async (taskId: string | number): Promise<void> => {
    const stringId = String(taskId);
    const current = get().excludedTaskIds;
    const isExcluded = current.includes(stringId);
    const next = isExcluded
      ? current.filter((id) => id !== stringId)
      : [...current, stringId];

    set({ excludedTaskIds: next });
    await saveExcludedTasksToDB(next);
    broadcastSyncEvent("TASK_EXCLUSION_CHANGED", { taskIds: next });
  },

  setAssistantName: async (name: string): Promise<void> => {
    const trimmed = name?.trim() || DEFAULT_ASSISTANT_NAME;
    set({ assistantName: trimmed });
    await saveAssistantNameToDB(trimmed);
    broadcastSyncEvent("ASSISTANT_NAME_CHANGED", { name: trimmed });
  },

  resetAssistantName: async (): Promise<void> => {
    set({ assistantName: DEFAULT_ASSISTANT_NAME });
    await clearAssistantNameFromDB();
    broadcastSyncEvent("ASSISTANT_NAME_CHANGED", { name: DEFAULT_ASSISTANT_NAME });
  },

  getDueTasks: <T extends ReviewTaskItem = ReviewTaskItem>(
    customTaskList: T[] = []
  ): Array<T & { reviewData?: ReviewItem }> => {
    const list = customTaskList || [];
    const reviews = get().reviews;
    const excluded = new Set(get().excludedTaskIds);

    return list
      .filter((task: T) => {
        if (excluded.has(String(task.id))) return false;
        const rev = reviews[String(task.id)];
        return rev && isTaskDue(rev);
      })
      .map((task: T) => ({
        ...task,
        reviewData: reviews[String(task.id)],
      }))
      .sort((a, b) => (a.reviewData?.nextReviewAt || 0) - (b.reviewData?.nextReviewAt || 0));
  },

  getMasteryStats: (customTaskList: ReviewTaskItem[] = []): MasteryStats => {
    const list = customTaskList || [];
    const reviews = get().reviews;
    const excluded = new Set(get().excludedTaskIds);
    const activeList = list.filter((task) => !excluded.has(String(task.id)));
    const totalCount = activeList.length;

    let dueToday = 0;
    let learning = 0;
    let reviewing = 0;
    let mastered = 0;
    let totalReviewed = 0;

    for (const task of activeList) {
      const rev = reviews[String(task.id)];
      if (rev && rev.stage > 0) {
        totalReviewed++;
        if (isTaskDue(rev)) {
          dueToday++;
        }
        if (rev.stage >= 5) {
          mastered++;
        } else if (rev.stage >= 3) {
          reviewing++;
        } else {
          learning++;
        }
      }
    }

    const unreviewed = Math.max(0, totalCount - totalReviewed);

    return {
      dueToday,
      learning,
      reviewing,
      mastered,
      totalReviewed,
      unreviewed,
      totalCount,
    };
  },

  handleResetReviews: async (
    scope = "section",
    taskIds: Array<string | number> = []
  ): Promise<void> => {
    if (scope === "all") {
      await clearAllReviewsFromDB();
      set({ reviews: {} });
      broadcastSyncEvent("REVIEWS_RESET", { all: true });
    } else if (taskIds.length > 0) {
      const stringIds = taskIds.map(String);
      await deleteReviewsForTasksFromDB(stringIds);
      const idsSet = new Set(stringIds);
      set((state) => {
        const updated: Record<string, ReviewItem> = {};
        for (const [id, rev] of Object.entries(state.reviews)) {
          if (!idsSet.has(String(id))) {
            updated[id] = rev;
          }
        }
        return { reviews: updated };
      });
      broadcastSyncEvent("REVIEWS_RESET", { taskIds: stringIds });
    }
  },
}));
