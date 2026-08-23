export type ReviewRating = "hard" | "medium" | "easy";

export interface ReviewHistoryEntry {
  date: number;
  localDate: string;
  rating: ReviewRating;
  stage: number;
  intervalDays: number;
  dueDate: string;
}

export interface ReviewItem {
  taskId: string;
  stage: number;
  intervalDays: number;
  lastReviewedAt: number;
  lastReviewedDate: string;
  dueDate: string;
  nextReviewAt: number;
  userTimezone?: string;
  rating: ReviewRating;
  history: ReviewHistoryEntry[];
}

export interface MasteryStats {
  dueToday: number;
  learning: number;
  reviewing: number;
  mastered: number;
  totalReviewed: number;
  unreviewed: number;
  totalCount: number;
}

export interface ReviewState {
  reviews: Record<string, ReviewItem>;
  isInitialized: boolean;
  initReviews: () => Promise<void>;
  submitReview: (taskId: string | number, rating?: ReviewRating) => Promise<void>;
  removeReview: (taskId: string | number) => Promise<void>;
  getDueTasks: (customTaskList?: any[]) => any[];
  getMasteryStats: (customTaskList?: any[]) => MasteryStats;
  handleResetReviews: (
    scope?: "all" | "section",
    taskIds?: Array<string | number>
  ) => Promise<void>;
}
