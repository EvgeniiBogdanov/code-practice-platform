import { create } from "zustand";
import {
  getAllReviewsFromDB,
  getReviewsFromLocalStorage,
  saveReviewToDB,
  deleteReviewFromDB,
  deleteReviewsForTasksFromDB,
  clearAllReviewsFromDB,
  broadcastSyncEvent,
  subscribeToSyncEvents,
} from "@/shared/lib/storage";
import { ReviewState, ReviewRating, ReviewItem, MasteryStats, ReviewTaskItem } from "../types";
import { calculateNextReview, isTaskDue } from "./sm2-algorithm";

const initialReviews =
  (getReviewsFromLocalStorage() as unknown as Record<string, ReviewItem>) || {};

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: initialReviews,
  isInitialized: true,

  initReviews: async (): Promise<void> => {
    try {
      const records = await getAllReviewsFromDB();
      if (records) {
        set({
          reviews: records as unknown as Record<string, ReviewItem>,
          isInitialized: true,
        });
      }

      subscribeToSyncEvents((event) => {
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

  getDueTasks: <T extends ReviewTaskItem = ReviewTaskItem>(
    customTaskList: T[] = []
  ): Array<T & { reviewData?: ReviewItem }> => {
    const list = customTaskList || [];
    const reviews = get().reviews;

    return list
      .filter((task: T) => {
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
    const totalCount = list.length;

    let dueToday = 0;
    let learning = 0;
    let reviewing = 0;
    let mastered = 0;
    let totalReviewed = 0;

    for (const task of list) {
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
