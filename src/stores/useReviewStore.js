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
} from "../services/storage";
import {
  calculateNextReview,
  isTaskDue,
  RATINGS,
  MAX_STAGE,
} from "../utils/spacedRepetition";
import { ALL_TASKS, TASKS_BY_ID } from "../data/tasksRegistry";

const initialReviews = getReviewsFromLocalStorage();

export const useReviewStore = create((set, get) => ({
  reviews: initialReviews || {},
  isInitialized: true,

  /**
   * Initializes review store from IndexedDB and listens for cross-tab updates.
   */
  initReviews: async () => {
    try {
      const records = await getAllReviewsFromDB();
      if (records) {
        set({
          reviews: records,
          isInitialized: true,
        });
      }

      // Cross-tab real-time sync
      subscribeToSyncEvents((event) => {
        if (event.type === "TASK_REVIEWED" && event.taskId && event.review) {
          set((state) => ({
            reviews: {
              ...state.reviews,
              [String(event.taskId)]: event.review,
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
              const updated = {};
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
    } catch (err) {
      console.error("[useReviewStore] Failed to initialize reviews:", err);
      set({ isInitialized: true });
    }
  },

  /**
   * Submits a review rating for a task (easy / medium / hard).
   * Calculates next review date and stage using SM-2 algorithm.
   * @param {string | number} taskId
   * @param {'easy' | 'medium' | 'hard'} rating
   */
  submitReview: async (taskId, rating = RATINGS.MEDIUM) => {
    if (!taskId) return;
    const stringId = String(taskId);
    const currentReview = get().reviews[stringId] || null;

    const nextReview = calculateNextReview(currentReview, rating);
    nextReview.taskId = stringId;

    set((state) => ({
      reviews: {
        ...state.reviews,
        [stringId]: nextReview,
      },
    }));

    await saveReviewToDB(stringId, nextReview);
    broadcastSyncEvent("TASK_REVIEWED", { taskId: stringId, review: nextReview });
  },

  /**
   * Removes a review schedule for a task.
   * @param {string | number} taskId
   */
  removeReview: async (taskId) => {
    if (!taskId) return;
    const stringId = String(taskId);

    set((state) => {
      const updated = { ...state.reviews };
      delete updated[stringId];
      return { reviews: updated };
    });

    await deleteReviewFromDB(stringId);
    broadcastSyncEvent("TASK_REVIEW_DELETED", { taskId: stringId });
  },

  /**
   * Returns list of tasks that are currently due for review (nextReviewAt <= Date.now()).
   * @param {Array<object>} [customTaskList]
   * @returns {Array<object>}
   */
  getDueTasks: (customTaskList) => {
    const list = customTaskList || ALL_TASKS;
    const reviews = get().reviews;

    return list
      .filter((task) => {
        const rev = reviews[String(task.id)];
        return rev && isTaskDue(rev);
      })
      .map((task) => ({
        ...task,
        reviewData: reviews[String(task.id)],
      }))
      .sort((a, b) => (a.reviewData?.nextReviewAt || 0) - (b.reviewData?.nextReviewAt || 0));
  },

  /**
   * Returns overall mastery statistics for review dashboard.
   * @param {Array<object>} [customTaskList]
   */
  getMasteryStats: (customTaskList) => {
    const list = customTaskList || ALL_TASKS;
    const reviews = get().reviews;
    const totalCount = list.length;

    let dueToday = 0;
    let learning = 0;   // Stage 1-2
    let reviewing = 0;  // Stage 3-4
    let mastered = 0;   // Stage 5-6 (Master)
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

  /**
   * Resets reviews for specific task IDs or all.
   * @param {'all' | 'section'} scope
   * @param {Array<string | number>} [taskIds]
   */
  handleResetReviews: async (scope = "section", taskIds = []) => {
    if (scope === "all") {
      await clearAllReviewsFromDB();
      set({ reviews: {} });
      broadcastSyncEvent("REVIEWS_RESET", { all: true });
    } else if (taskIds.length > 0) {
      const stringIds = taskIds.map(String);
      await deleteReviewsForTasksFromDB(stringIds);
      const idsSet = new Set(stringIds);
      set((state) => {
        const updated = {};
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
