import { Task } from "@/entities/task";
import styles from "../ui/GroupOverviewPage.module.css";

export const getTaskGradientClass = (
  task: Task,
  status: "solved" | "unsolved" | "unstarted",
  taskReview: any
): string => {
  if (status === "unsolved") {
    return styles.ratingGradientUnsolved;
  }
  if (status === "solved") {
    if (taskReview?.rating === "hard") return styles.ratingGradientHard;
    if (taskReview?.rating === "medium") return styles.ratingGradientMedium;
    if (taskReview?.rating === "easy") return styles.ratingGradientEasy;

    const d = String(task?.difficulty || "").toLowerCase();
    if (d === "hard" || d === "strong") return styles.ratingGradientHard;
    if (d === "medium" || d === "middle" || d === "refactoring" || d === "ts") {
      return styles.ratingGradientMedium;
    }
    return styles.ratingGradientEasy;
  }
  return "";
};

export const getTaskTooltipTitle = (
  task: Task,
  status: "solved" | "unsolved" | "unstarted",
  taskReview: any
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

    const d = String(task?.difficulty || "").toLowerCase();
    const diffLabel =
      d === "hard" || d === "strong"
        ? "Сложная"
        : d === "medium" || d === "middle" || d === "refactoring" || d === "ts"
          ? "Средняя"
          : "Легкая";

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
