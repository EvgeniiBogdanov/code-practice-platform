/**
 * Перевод значений сложности задач на русский язык для отображения на бейджах
 */
export const getDifficultyLabel = (difficulty) => {
  if (!difficulty) return "";
  const d = String(difficulty).toLowerCase();
  switch (d) {
    case "easy":
      return "Легкая";
    case "medium":
      return "Средняя";
    case "hard":
      return "Сложная";
    case "warm-up":
    case "warmup":
      return "Warm-up";
    case "refactoring":
      return "Refactoring";
    case "middle":
      return "Middle";
    case "strong":
      return "Strong";
    case "ts":
      return "TypeScript";
    default:
      return difficulty;
  }
};
