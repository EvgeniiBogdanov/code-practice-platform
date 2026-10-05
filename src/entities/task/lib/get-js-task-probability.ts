import type { MetaBadgeVariant } from "@/shared/ui";
import type { Task } from "../types";
import { TASK_PROBABILITY_OVERRIDES } from "./js-task-probability-overrides";

export interface TaskProbabilityInfo {
  probability: number | null;
  variant: MetaBadgeVariant;
  label: string;
  tooltip: string;
}

export const isSyntaxTask = (title: string): boolean => {
  const t = (title || "").toLowerCase();
  return (
    t.includes("синтаксис") ||
    t.includes("базовый синтаксис") ||
    t.includes("базовый пример") ||
    t.includes("деструктуризация") ||
    t.includes("создание, чтение, запись") ||
    t.includes("создание set") ||
    t.includes("создание map") ||
    t.includes("создание promise") ||
    t.includes("базовый async/await") ||
    t.includes("что такое база рекурсии") ||
    t.includes("базовый вывод") ||
    t.includes("базовый интервал") ||
    t.endsWith("finally") ||
    t.includes("reject и catch") ||
    t.includes("цепочка then") ||
    t.includes("crud & computed keys")
  );
};

export const getProbabilityBadgeVariant = (probability: number): MetaBadgeVariant => {
  if (probability >= 75) return "green";
  if (probability >= 50) return "yellow";
  if (probability >= 25) return "orange";
  return "gray";
};

export const getProbabilityBadgeLabel = (probability: number): string => {
  return `Вероятность: ${Math.round(probability)}%`;
};

export const getProbabilityBadgeTitle = (probability: number): string => {
  const p = Math.round(probability);
  if (p >= 90)
    return `Вероятность на Middle/Senior: ${p}% (Критически высокая — стандарт live coding)`;
  if (p >= 75) return `Вероятность на Middle/Senior: ${p}% (Высокая — частый вопрос)`;
  if (p >= 50) return `Вероятность на Middle/Senior: ${p}% (Умеренная — практическая задача)`;
  return `Вероятность на Middle/Senior: ${p}% (Низкая — элементарная разминка)`;
};

const inferFallbackProbability = (group: string, subgroup: string, title: string): number => {
  const t = title.toLowerCase();
  const g = group || "";
  const s = subgroup || "";

  if (s === "Полифилы" || t.includes("полифил")) return 92;
  if (g === "Паттерны проектирования" || s.includes("паттерн")) return 92;
  if (s === "Контроль частоты" || t.includes("debounce") || t.includes("throttle")) return 96;
  if (g === "Асинхронность" || s === "Event Loop") return 90;
  if (s === "Каррирование" || s === "Кеширование и мемоизация") return 94;
  if (g === "this, прототипы и классы") return 88;
  if (g === "Рекурсия") return 88;
  if (g === "Объекты" && (t.includes("глубок") || t.includes("lodash"))) return 92;
  if (g === "Массивы" && s === "reduce") return 85;
  if (g === "Коллекции" && (s === "Map" || s === "Set")) return 82;
  if (t.includes("поиск") || t.includes("палиндром")) return 84;
  if (
    g === "Циклы" &&
    (t.includes("вывести") || t.includes("сумма чисел") || t.includes("чётные"))
  ) {
    return 8;
  }

  return 50;
};

export const getJsTaskProbability = (task: Task): number | null => {
  if (task.section !== "javascript") {
    return null;
  }

  const title = task.title || "";
  if (isSyntaxTask(title)) {
    return null;
  }

  const id = String(task.id);
  if (id in TASK_PROBABILITY_OVERRIDES) {
    return TASK_PROBABILITY_OVERRIDES[id];
  }

  return inferFallbackProbability(task.group || "", task.subgroup || "", title);
};

export const getJsTaskProbabilityInfo = (task: Task): TaskProbabilityInfo | null => {
  const probability = getJsTaskProbability(task);
  if (probability === null) {
    return null;
  }

  return {
    probability,
    variant: getProbabilityBadgeVariant(probability),
    label: getProbabilityBadgeLabel(probability),
    tooltip: getProbabilityBadgeTitle(probability),
  };
};
