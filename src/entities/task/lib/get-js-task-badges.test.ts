import { describe, it, expect } from "vitest";
import React from "react";
import { BookOpen } from "lucide-react";
import { JS_TASKS } from "../curriculum/javascript/data/tasksData";
import { getJsTaskBadges } from "./get-js-task-badges";
import type { Task } from "../types";

const ALGORITHM_BADGES_BY_TASK_ID = [
  ["js_while_3", "Базовый алгоритм"],
  ["js_while_4", "Базовый алгоритм"],
  ["js_while_5", "Math: Euclidean Algorithm"],
  ["js_while_6", "Binary Search: Classic"],
  ["js_while_7", "Linked List: Traversal"],
  ["js_while_8", "Two Pointers: Classic"],
  ["js5", "Базовый алгоритм"],
  ["js7", "Sorting: Bubble Sort"],
  ["js83", "Hash Map: Set"],
  ["js96", "Hash Map: Frequency"],
  ["js99", "Hash Map: Grouping"],
  ["js196", "Hash Map: Lookup"],
  ["js241", "Hash Map: Memoization"],
  ["js242", "Hash Map: Lookup"],
  ["js133", "Базовый алгоритм"],
  ["js134", "Базовый алгоритм"],
  ["js135", "Базовый алгоритм"],
  ["js136", "Базовый алгоритм"],
  ["js137", "DFS: Traversal"],
  ["js138", "DFS: Traversal"],
  ["js139", "DFS: Bottom-Up"],
  ["js140", "DFS: Bottom-Up"],
  ["js141", "DFS: Bottom-Up"],
  ["js142", "DFS: Traversal"],
  ["js143", "DFS: Bottom-Up"],
  ["js144", "DFS: Traversal"],
  ["js145", "DFS: Traversal"],
  ["js146", "DFS: Bottom-Up"],
  ["js147", "Базовый алгоритм"],
  ["js227", "DFS: Traversal"],
] as const;

const javascriptTasks = JS_TASKS as Task[];

describe("getJsTaskBadges", () => {
  it("classifies basic syntax tasks without interview probability badge", () => {
    const task: Task = {
      id: "js_while_1",
      title: "1. Напиши базовый синтаксис цикла while",
      group: "Циклы",
      subgroup: "while",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Синтаксис")).toBe(true);
    expect(badges.some((b) => b.id === "interview-probability")).toBe(false);
  });

  it("includes interview probability badge for regular JS tasks", () => {
    const task: Task = {
      id: "js70",
      title: "1. Практическая задача - debounce",
      group: "Асинхронность",
      subgroup: "Контроль частоты",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    const probBadge = badges.find((b) => b.id === "interview-probability");
    expect(probBadge).toBeDefined();
    expect(probBadge?.label).toBe("Вероятность: 99%");
    expect(probBadge?.variant).toBe("green");
    expect(probBadge?.title).toContain("Критически высокая");
  });

  it("classifies Binary Search algorithm correctly with capitalized label and blue variant", () => {
    const task: Task = {
      id: "js_while_6",
      title: "6. Бинарный поиск",
      group: "Циклы",
      subgroup: "while",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Алгоритм")).toBe(true);
    const bsBadge = badges.find((b) => b.label === "Binary Search: Classic");
    expect(bsBadge).toBeDefined();
    expect(bsBadge?.variant).toBe("blue");
    expect(badges.some((b) => b.label === "Вероятность: 85%")).toBe(true);
  });

  it("classifies js5 by its reverse-scan solution instead of inferring Two Pointers", () => {
    const task: Task = {
      id: "js5",
      title: "5. Палиндром",
      group: "Циклы",
      subgroup: "for",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Базовый алгоритм")).toBe(true);
    expect(badges.some((b) => b.label === "Алгоритм")).toBe(false);
    expect(badges.some((b) => b.label === "Two Pointers: Classic")).toBe(false);
    expect(badges.some((b) => b.label === "Циклы")).toBe(true);
  });

  it("classifies Hash Map algorithm correctly with capitalized label and yellow variant", () => {
    const task: Task = {
      id: "js99",
      title: "9. Анаграммы (Company X) (Уровень 3)",
      group: "Коллекции",
      subgroup: "Map",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Алгоритм")).toBe(true);
    const hmBadge = badges.find((b) => b.label === "Hash Map: Grouping");
    expect(hmBadge).toBeDefined();
    expect(hmBadge?.variant).toBe("yellow");
  });

  it("classifies DFS algorithm correctly with capitalized label and green variant", () => {
    const task: Task = {
      id: "js140",
      title: "3. Обход бинарного дерева (сумма значений)",
      group: "Рекурсия",
      subgroup: "Вложенные структуры",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Алгоритм")).toBe(true);
    const dfsBadge = badges.find((b) => b.label === "DFS: Bottom-Up");
    expect(dfsBadge).toBeDefined();
    expect(dfsBadge?.variant).toBe("green");
  });

  it("classifies basic algorithm correctly with capitalized label and folder badge without redundant Алгоритм badge", () => {
    const task: Task = {
      id: "js_while_3",
      title: "3. Сумма цифр числа",
      group: "Циклы",
      subgroup: "while",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Базовый алгоритм")).toBe(true);
    expect(badges.some((b) => b.label === "Алгоритм")).toBe(false);
    expect(badges.some((b) => b.label === "Циклы")).toBe(true);
    const loopBadge = badges.find((b) => b.label === "Циклы");
    expect(loopBadge?.id).toBe("loops");
    expect(loopBadge?.variant).toBe("blue");
  });

  it("includes folder badge for basic algorithm tasks in recursion group", () => {
    const task: Task = {
      id: "js133",
      title: "2. Рекурсия 'вверх' (печать при возврате)",
      group: "Рекурсия",
      subgroup: "База рекурсии",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Базовый алгоритм")).toBe(true);
    expect(badges.some((b) => b.label === "Алгоритм")).toBe(false);
    expect(badges.some((b) => b.label === "Рекурсия")).toBe(true);
    const recursionBadge = badges.find((b) => b.label === "Рекурсия");
    expect(recursionBadge?.id).toBe("recursion");
    expect(recursionBadge?.variant).toBe("orange");
  });

  it("classifies utility tasks like debounce correctly with capitalized label", () => {
    const task: Task = {
      id: "js70",
      title: "1. Практическая задача - debounce",
      group: "Асинхронность",
      subgroup: "Контроль частоты",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Утилита")).toBe(true);
    expect(badges.some((b) => b.label === "Асинхронность")).toBe(true);
  });

  it("classifies polyfill tasks correctly with capitalized label", () => {
    const task: Task = {
      id: "js158",
      title: "1. Полифил Promise.all",
      group: "Асинхронность",
      subgroup: "Полифилы",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Полифил")).toBe(true);
    expect(badges.some((b) => b.label === "Асинхронность")).toBe(true);
  });

  it("classifies pattern tasks correctly with capitalized label", () => {
    const task: Task = {
      id: "js171",
      title: "1. Шина событий (EventEmitter / PubSub)",
      group: "Паттерны проектирования",
      subgroup: "Паттерн Наблюдатель",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Паттерн")).toBe(true);
  });

  it("classifies fundamental base tasks correctly with capitalized label and yellow variant", () => {
    const task: Task = {
      id: "js2",
      title: "2. Вывести числа от 1 до N",
      group: "Циклы",
      subgroup: "for",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    const baseBadge = badges.find((b) => b.label === "База");
    expect(baseBadge).toBeDefined();
    expect(baseBadge?.variant).toBe("yellow");
    expect(React.isValidElement(baseBadge?.icon)).toBe(true);
    const iconElement = baseBadge?.icon as React.ReactElement<{ size?: number }>;
    expect(iconElement.type).toBe(BookOpen);
    expect(iconElement.props.size).toBe(12);
  });

  it.each(ALGORITHM_BADGES_BY_TASK_ID)(
    "matches the audited solution for %s with the %s badge",
    (taskId, expectedDetailLabel) => {
      const task = javascriptTasks.find(({ id }) => id === taskId);
      expect(task, `JavaScript task ${taskId} must exist`).toBeDefined();

      const algorithmBadges = getJsTaskBadges(task as Task).filter(({ id }) =>
        id.startsWith("algo")
      );
      const expectedLabels =
        expectedDetailLabel === "Базовый алгоритм"
          ? [expectedDetailLabel]
          : ["Алгоритм", expectedDetailLabel];

      expect(algorithmBadges.map(({ label }) => label)).toEqual(expectedLabels);
    }
  );

  it("does not infer algorithm badges from task titles", () => {
    const auditedTaskIds = new Set<string>(
      ALGORITHM_BADGES_BY_TASK_ID.map(([taskId]) => taskId)
    );
    const unexpectedAlgorithmBadges = javascriptTasks.flatMap((task) => {
      if (auditedTaskIds.has(String(task.id))) return [];

      return getJsTaskBadges(task)
        .filter(({ id }) => id.startsWith("algo"))
        .map(({ label }) => `${task.id}: ${label}`);
    });

    expect(unexpectedAlgorithmBadges).toEqual([]);
  });
});
