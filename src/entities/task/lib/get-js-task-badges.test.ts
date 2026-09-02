import { describe, it, expect } from "vitest";
import { getJsTaskBadges } from "./get-js-task-badges";
import type { Task } from "../types";

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
    const bsBadge = badges.find((b) => b.label === "Binary Search");
    expect(bsBadge).toBeDefined();
    expect(bsBadge?.variant).toBe("blue");
    expect(badges.some((b) => b.label === "Вероятность: 85%")).toBe(true);
  });

  it("classifies Two Pointers algorithm correctly with capitalized label and pink variant", () => {
    const task: Task = {
      id: "js5",
      title: "5. Палиндром",
      group: "Циклы",
      subgroup: "for",
      section: "javascript",
    };

    const badges = getJsTaskBadges(task);
    expect(badges.some((b) => b.label === "Алгоритм")).toBe(true);
    const tpBadge = badges.find((b) => b.label === "Two Pointers");
    expect(tpBadge).toBeDefined();
    expect(tpBadge?.variant).toBe("pink");
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
    const hmBadge = badges.find((b) => b.label === "Hash Map");
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
    const dfsBadge = badges.find((b) => b.label === "DFS");
    expect(dfsBadge).toBeDefined();
    expect(dfsBadge?.variant).toBe("green");
  });

  it("classifies basic algorithm correctly with capitalized label without redundant Алгоритм badge", () => {
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
  });
});
