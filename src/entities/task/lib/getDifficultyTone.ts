export type DifficultyTone = "easy" | "medium" | "hard";

const DIFFICULTY_TONES: Record<string, DifficultyTone> = {
  easy: "easy",
  junior: "easy",
  "warm-up": "easy",
  medium: "medium",
  middle: "medium",
  refactoring: "medium",
  hard: "hard",
  senior: "hard",
};

export const getDifficultyTone = (difficulty?: string): DifficultyTone | null =>
  DIFFICULTY_TONES[String(difficulty ?? "").toLowerCase()] ?? null;
