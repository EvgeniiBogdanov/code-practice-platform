import { describe, it, expect } from "vitest";
import { JS_TASKS } from "../curriculum/javascript/data/tasksData";
import { TASK_PROBABILITY_OVERRIDES } from "./jsTaskProbabilityOverrides";
import {
  isSyntaxTask,
  getJsTaskProbability,
  getJsTaskProbabilityInfo,
  getProbabilityBadgeVariant,
  getProbabilityBadgeLabel,
  getProbabilityBadgeTitle,
} from "./getJsTaskProbability";
import type { Task } from "../types";

describe("getJsTaskProbability (Middle to Senior calibration)", () => {
  describe("isSyntaxTask", () => {
    it("identifies syntax drill tasks correctly", () => {
      expect(isSyntaxTask("1. Напиши базовый синтаксис цикла while")).toBe(true);
      expect(isSyntaxTask("1. Напиши базовый синтаксис цикла for")).toBe(true);
      expect(isSyntaxTask("1. Напиши базовый пример setTimeout")).toBe(true);
      expect(isSyntaxTask("4. Деструктуризация объектов")).toBe(true);
      expect(isSyntaxTask("1. Создание Set из массива")).toBe(true);
      expect(isSyntaxTask("1. Создание Promise (Уровень 1)")).toBe(true);
      expect(isSyntaxTask("1. Базовый async/await (Уровень 2)")).toBe(true);
      expect(isSyntaxTask("1. Что такое база рекурсии (base case)")).toBe(true);
      expect(isSyntaxTask("4. finally")).toBe(true);
    });

    it("does not flag regular coding tasks as syntax", () => {
      expect(isSyntaxTask("1. Практическая задача - debounce")).toBe(false);
      expect(isSyntaxTask("1. Полифил Promise.all")).toBe(false);
      expect(isSyntaxTask("1. Шина событий (EventEmitter / PubSub)")).toBe(false);
      expect(isSyntaxTask("6. Бинарный поиск")).toBe(false);
      expect(
        isSyntaxTask("1. Поток управления в try / catch / finally: Приоритеты return и throw")
      ).toBe(false);
    });
  });

  describe("TASK_PROBABILITY_OVERRIDES", () => {
    const javascriptTasks = JS_TASKS as Task[];
    const taskIds = new Set(javascriptTasks.map(({ id }) => String(id)));

    it("references only existing JavaScript tasks", () => {
      const unknownIds = Object.keys(TASK_PROBABILITY_OVERRIDES).filter((id) => !taskIds.has(id));
      expect(unknownIds).toEqual([]);
    });

    it("calibrates every non-syntax JavaScript task explicitly", () => {
      const uncalibrated = javascriptTasks
        .filter((task) => !isSyntaxTask(task.title || ""))
        .map(({ id }) => String(id))
        .filter((id) => !(id in TASK_PROBABILITY_OVERRIDES));
      expect(uncalibrated).toEqual([]);
    });
  });

  describe("getJsTaskProbability", () => {
    it("returns null for non-javascript section tasks", () => {
      const reactTask: Task = {
        id: "react-1",
        title: "Simple Counter",
        section: "react",
      };
      expect(getJsTaskProbability(reactTask)).toBeNull();
    });

    it("returns null for syntax warm-up tasks", () => {
      const syntaxTask: Task = {
        id: "js_while_1",
        title: "1. Напиши базовый синтаксис цикла while",
        group: "Циклы",
        subgroup: "while",
        section: "javascript",
      };
      expect(getJsTaskProbability(syntaxTask)).toBeNull();
    });

    it("returns low probability (< 25%) for elementary loop drills on Middle/Senior positions", () => {
      const basicLoopTask: Task = {
        id: "js2",
        title: "2. Вывести числа от 1 до N",
        group: "Циклы",
        subgroup: "for",
        section: "javascript",
      };
      expect(getJsTaskProbability(basicLoopTask)).toBe(5);

      const sumTask: Task = {
        id: "js3",
        title: "3. Сумма чисел от 1 до N",
        group: "Циклы",
        subgroup: "for",
        section: "javascript",
      };
      expect(getJsTaskProbability(sumTask)).toBe(8);
    });

    it("returns critically high probability (>= 95%) for Middle+/Senior live coding staples", () => {
      const debounceTask: Task = {
        id: "js70",
        title: "1. Практическая задача - debounce",
        group: "Асинхронность",
        subgroup: "Контроль частоты",
        section: "javascript",
      };
      expect(getJsTaskProbability(debounceTask)).toBe(99);

      const promiseAllTask: Task = {
        id: "js158",
        title: "1. Полифил Promise.all",
        group: "Асинхронность",
        subgroup: "Полифилы",
        section: "javascript",
      };
      expect(getJsTaskProbability(promiseAllTask)).toBe(98);

      const eventEmitterTask: Task = {
        id: "js171",
        title: "1. Шина событий (EventEmitter / PubSub)",
        group: "Паттерны проектирования",
        subgroup: "Паттерн Наблюдатель",
        section: "javascript",
      };
      expect(getJsTaskProbability(eventEmitterTask)).toBe(98);

      const deepCloneTask: Task = {
        id: "js210",
        title: "6. Глубокое клонирование с циклическими ссылками (deepClone + WeakMap)",
        group: "Рекурсия",
        subgroup: "Объекты: задачи с собеседований",
        section: "javascript",
      };
      expect(getJsTaskProbability(deepCloneTask)).toBe(98);

      const concurrencyTask: Task = {
        id: "js116",
        title: "2. Ограничение параллельности (concurrency pool)",
        group: "Асинхронность",
        subgroup: "Продвинутые паттерны",
        section: "javascript",
      };
      expect(getJsTaskProbability(concurrencyTask)).toBe(98);
    });

    it("returns correct probability for Middle algorithms and data structures", () => {
      const binarySearchTask: Task = {
        id: "js_while_6",
        title: "6. Бинарный поиск",
        group: "Циклы",
        subgroup: "while",
        section: "javascript",
      };
      expect(getJsTaskProbability(binarySearchTask)).toBe(85);

      const twoPointersTask: Task = {
        id: "js_while_8",
        title: "8. Слияние двух отсортированных массивов",
        group: "Циклы",
        subgroup: "for",
        section: "javascript",
      };
      expect(getJsTaskProbability(twoPointersTask)).toBe(94);
    });
  });

  describe("getJsTaskProbabilityInfo", () => {
    it("returns null for syntax tasks", () => {
      const syntaxTask: Task = {
        id: "js103",
        title: "1. Создание Promise (Уровень 1)",
        group: "Асинхронность",
        subgroup: "Основы Promise",
        section: "javascript",
      };
      expect(getJsTaskProbabilityInfo(syntaxTask)).toBeNull();
    });

    it("returns complete formatted info for Middle/Senior interview tasks", () => {
      const task: Task = {
        id: "js70",
        title: "1. Практическая задача - debounce",
        group: "Асинхронность",
        subgroup: "Контроль частоты",
        section: "javascript",
      };

      const info = getJsTaskProbabilityInfo(task);
      expect(info).not.toBeNull();
      expect(info?.probability).toBe(99);
      expect(info?.variant).toBe("green");
      expect(info?.label).toBe("Вероятность: 99%");
      expect(info?.tooltip).toContain("Middle/Senior");
      expect(info?.tooltip).toContain("Критически высокая");
    });
  });

  describe("helper functions", () => {
    it("maps variants by 4-color gauge sectors correctly (gray -> orange -> yellow -> green)", () => {
      expect(getProbabilityBadgeVariant(95)).toBe("green");
      expect(getProbabilityBadgeVariant(80)).toBe("green");
      expect(getProbabilityBadgeVariant(75)).toBe("green");
      expect(getProbabilityBadgeVariant(60)).toBe("yellow");
      expect(getProbabilityBadgeVariant(50)).toBe("yellow");
      expect(getProbabilityBadgeVariant(40)).toBe("orange");
      expect(getProbabilityBadgeVariant(25)).toBe("orange");
      expect(getProbabilityBadgeVariant(20)).toBe("gray");
      expect(getProbabilityBadgeVariant(10)).toBe("gray");
      expect(getProbabilityBadgeVariant(0)).toBe("gray");
    });

    it("formats labels and titles correctly for Middle/Senior context", () => {
      expect(getProbabilityBadgeLabel(87.4)).toBe("Вероятность: 87%");
      expect(getProbabilityBadgeTitle(95)).toContain("Критически высокая");
      expect(getProbabilityBadgeTitle(80)).toContain("Высокая");
      expect(getProbabilityBadgeTitle(60)).toContain("Умеренная");
      expect(getProbabilityBadgeTitle(15)).toContain("Низкая");
    });
  });
});
