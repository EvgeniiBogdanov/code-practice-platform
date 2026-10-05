import { getDifficultyTone, type Task } from "@/entities/task";
import { ReviewItem } from "@/entities/review";
import styles from "../ui/GroupOverviewPage.module.css";

export const getTaskGradientClass = (
  task: Task,
  status: "solved" | "unsolved" | "unstarted",
  taskReview: ReviewItem | null | undefined
): string => {
  if (status === "unsolved") {
    return styles.ratingGradientUnsolved;
  }
  if (status === "solved") {
    if (taskReview?.rating === "hard") return styles.ratingGradientHard;
    if (taskReview?.rating === "medium") return styles.ratingGradientMedium;
    if (taskReview?.rating === "easy") return styles.ratingGradientEasy;

    const tone = getDifficultyTone(task?.difficulty);
    if (tone === "hard") return styles.ratingGradientHard;
    if (tone === "medium") return styles.ratingGradientMedium;
    return styles.ratingGradientEasy;
  }
  return "";
};

export const getTaskTooltipTitle = (
  task: Task,
  status: "solved" | "unsolved" | "unstarted",
  taskReview: ReviewItem | null | undefined
): string => {
  if (status === "unsolved") {
    return `${task.title} • Статус: Не решено`;
  }
  if (status === "solved") {
    const ratingLabel =
      taskReview?.rating === "hard"
        ? "Сложно"
        : taskReview?.rating === "medium"
          ? "Средне"
          : taskReview?.rating === "easy"
            ? "Легко"
            : null;

    if (ratingLabel) {
      return `${task.title} • Оценка сложности: ${ratingLabel}`;
    }

    const tone = getDifficultyTone(task?.difficulty);
    const diffLabel = tone === "hard" ? "Сложная" : tone === "medium" ? "Средняя" : "Легкая";

    return `${task.title} • Сложность: ${diffLabel}`;
  }
  return `${task.title} • Статус: Не начато`;
};

export const calculateReadingTime = (text?: string): number => {
  if (!text) return 5;
  const cleanText = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/#+|_|\*|`|\[.*?\]\(.*?\)/g, " ")
    .trim();
  const words = cleanText.split(/\s+/).filter(Boolean).length;
  const codeBlocks = (text.match(/```[\s\S]*?```/g) || []).length;
  const totalMinutes = Math.ceil(words / 140 + codeBlocks * 0.7);
  return Math.max(1, totalMinutes);
};
