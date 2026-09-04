import { beforeAll, describe, it, expect } from "vitest";
import { getTaskById, getTasksBySection, searchTasks } from "./taskRegistry";
import { getTaskHints } from "../curriculum/javascript/data/jsHints";
import { TASK_EXPLANATIONS } from "../curriculum/taskExplanations";

describe("taskRegistry", () => {
  beforeAll(async () => {
    await Promise.all([getTasksBySection("javascript"), getTasksBySection("react")]);
  });

  it("should retrieve the new Category Tree task (js196) with all metadata populated", async () => {
    const task = await getTaskById("js196");
    expect(task).toBeDefined();
    expect(task?.id).toBe("js196");
    expect(task?.group).toBe("Коллекции");
    expect(task?.subgroup).toBe("Map");
    expect(task?.title).toContain("Преобразование списка категорий");
    expect(task?.section).toBe("javascript");

    // Candidate code
    expect(task?.candidate).toBeDefined();
    expect(task?.candidate).toContain("createCategoryTree");

    // Candidate code
    expect(task?.candidate).toBeDefined();
    expect(task?.candidate).toContain("const createCategoryTree = (list) =>");

    // Solution code
    expect(task?.solution).toBeDefined();
    expect(task?.solution).toContain("nodeMap = new Map()");
    expect(task?.solution).toContain("const createCategoryTree = (list) =>");

    // Explanation
    expect(task?.explanation).toBeDefined();
    expect(TASK_EXPLANATIONS.js196).toBeDefined();
    expect(TASK_EXPLANATIONS.js196).toContain("const createCategoryTree = (list) =>");

    // Articles & Resources
    expect(task?.articles).toBeDefined();
    expect(task?.articles?.length).toBeGreaterThanOrEqual(4);

    // Interviewer questions
    expect(task?.interviewerQuestions?.length).toBeGreaterThanOrEqual(4);

    // Checklist
    expect(task?.checklist?.length).toBeGreaterThanOrEqual(5);

    // Progressive Hints
    const hints = getTaskHints("js196");
    expect(hints).toBeDefined();
    expect(hints?.level1?.content).toContain("Map");
    expect(hints?.level2?.content).toContain("children");
    expect(hints?.level3?.content).toContain("const createCategoryTree = (list) =>");
  });

  it("should find the task in searchTasks query", async () => {
    const results = await searchTasks("Преобразование списка категорий", "javascript");
    expect(results.some((t) => t.id === "js196")).toBe(true);
  });

  it("should include js196 in javascript section tasks", async () => {
    const jsTasks = await getTasksBySection("javascript");
    expect(jsTasks.some((t) => t.id === "js196")).toBe(true);
  });

  it("should retrieve the new React Timer Refactoring task (r16) with all metadata populated", async () => {
    const task = await getTaskById("r16");
    expect(task).toBeDefined();
    expect(task?.id).toBe("r16");
    expect(task?.category).toBe("Рефакторинг");
    expect(task?.title).toContain("Рефакторинг (Company X)");
    expect(task?.section).toBe("react");

    // Candidate code and component
    expect(task?.candidate).toBeDefined();
    expect(task?.rawCandidate).toContain("useRef");
    expect(task?.rawCandidate).toContain("document.querySelector");

    // Solution code and component
    expect(task?.solution).toBeDefined();
    expect(task?.rawSolution).toContain("useTimer");
    expect(task?.rawSolution).toContain("formatTime");

    // Explanation
    expect(TASK_EXPLANATIONS.r16).toBeDefined();
    expect(TASK_EXPLANATIONS.r16).toContain("useTimer()");

    // Articles
    expect(task?.articles).toBeDefined();
    expect(task?.articles?.length).toBeGreaterThanOrEqual(4);

    // Interviewer questions
    expect(task?.interviewerQuestions?.length).toBeGreaterThanOrEqual(4);

    // Multi-file structure
    expect(task?.isMultiFile).toBe(true);
    expect(task?.files?.length).toBe(2);
    expect(task?.files?.[0].name).toBe("App.jsx");
    expect(task?.files?.[1].name).toBe("App.css");
    expect(task?.files?.[0].candidateCode).toContain("const App = () =>");
    expect(task?.files?.[0].candidateCode).toContain('{">>>"} : {currentTime}');
    expect(task?.files?.[0].solutionCode).toContain("const useTimer = () =>");
    expect(task?.files?.[0].solutionCode).toContain("const App = () =>");
    expect(task?.files?.[1].candidateCode).toContain(".pulsate");
    expect(task?.files?.[1].solutionCode).toContain(".pulsate");

    // Checklist
    expect(task?.checklist?.length).toBeGreaterThanOrEqual(6);
  });

  it("should retrieve React UserPostsList Refactoring task (r15) with in-depth explanation", async () => {
    const task = await getTaskById("r15");
    expect(task).toBeDefined();
    expect(task?.id).toBe("r15");
    expect(task?.category).toBe("Рефакторинг");
    expect(task?.title).toContain("Рефакторинг (Company X)");
    expect(task?.section).toBe("react");

    // Candidate and Solution code
    expect(task?.candidate).toBeDefined();
    expect(task?.solution).toBeDefined();
    expect(task?.rawSolution).toContain("isMounted");

    // In-depth explanation
    expect(TASK_EXPLANATIONS.r15).toBeDefined();
    expect(TASK_EXPLANATIONS.r15).toContain("UserPostsList");
    expect(TASK_EXPLANATIONS.r15).toContain("isMounted");
    expect(TASK_EXPLANATIONS.r15).toContain("useCallback");
    expect(TASK_EXPLANATIONS.r15).toContain("posts.sort()");
  });

  it("should retrieve React RandomNumberGenerator Refactoring task (r17) with all metadata and multi-file structure", async () => {
    const task = await getTaskById("r17");
    expect(task).toBeDefined();
    expect(task?.id).toBe("r17");
    expect(task?.category).toBe("Рефакторинг");
    expect(task?.title).toContain("17. Рефакторинг (Company X)");
    expect(task?.section).toBe("react");

    // Candidate code and component
    expect(task?.candidate).toBeDefined();
    expect(task?.rawCandidate).toContain("toggleVisibleList");
    expect(task?.rawCandidate).toContain("setVisibleList(visibleList)");

    // Solution code and component
    expect(task?.solution).toBeDefined();
    expect(task?.rawSolution).toContain("setVisibleList((prev) => !prev)");
    expect(task?.rawSolution).toContain("timerRef");
    expect(task?.rawSolution).toContain("removeNumber");

    // Explanation
    expect(TASK_EXPLANATIONS.r17).toBeDefined();
    expect(TASK_EXPLANATIONS.r17).toContain("Lifting State Up");
    expect(TASK_EXPLANATIONS.r17).toContain("useRef");

    // Articles
    expect(task?.articles).toBeDefined();
    expect(task?.articles?.length).toBeGreaterThanOrEqual(5);

    // Interviewer questions
    expect(task?.interviewerQuestions?.length).toBeGreaterThanOrEqual(5);

    // Multi-file structure (3 files: App.jsx, Buttons.jsx, List.jsx)
    expect(task?.isMultiFile).toBe(true);
    expect(task?.files?.length).toBe(3);
    expect(task?.files?.[0].name).toBe("App.jsx");
    expect(task?.files?.[1].name).toBe("Buttons.jsx");
    expect(task?.files?.[2].name).toBe("List.jsx");
    expect(task?.files?.[0].candidateCode).toContain("toggleVisibleList");
    expect(task?.files?.[0].solutionCode).toContain("addRandomNumber");
    expect(task?.files?.[1].candidateCode).toContain("Новое число");
    expect(task?.files?.[1].solutionCode).toContain("disabled={!started}");
    expect(task?.files?.[2].candidateCode).toContain("let timer = null");
    expect(task?.files?.[2].solutionCode).toContain("timerRef");

    // Checklist
    expect(task?.checklist?.length).toBeGreaterThanOrEqual(8);
  });

  it("should find r16 and r17 in react section tasks", async () => {
    const reactTasks = await getTasksBySection("react");
    expect(reactTasks.some((t) => t.id === "r16")).toBe(true);
    expect(reactTasks.some((t) => t.id === "r17")).toBe(true);
  });

  it("should retrieve React URLSearchParams task (id: 13) with all metadata populated", async () => {
    const task = await getTaskById(13);
    expect(task).toBeDefined();
    expect(task?.id).toBe(13);
    expect(task?.category).toBe("UI-компоненты и паттерны");
    expect(task?.difficulty).toBe("middle");
    expect(task?.title).toContain("Синхронизация фильтров с URL");
    expect(task?.section).toBe("react");

    // Candidate code and raw code (no spoilers in candidate code)
    expect(task?.candidate).toBeDefined();
    expect(task?.rawCandidate).not.toContain("URLSearchParams");
    expect(task?.rawCandidate).toContain("PRODUCTS");
    expect(task?.rawCandidate).toContain("ProductCatalogUrlSync");

    // Solution code and raw code
    expect(task?.solution).toBeDefined();
    expect(task?.rawSolution).toContain("URLSearchParams");
    expect(task?.rawSolution).toContain("parseFiltersFromUrl");
    expect(task?.rawSolution).toContain("serializeFiltersToQuery");
    expect(task?.rawSolution).toContain("replaceState");
    expect(task?.rawSolution).toContain("popstate");

    // In-depth explanation
    expect(TASK_EXPLANATIONS[13]).toBeDefined();
    expect(TASK_EXPLANATIONS[13]).toContain("URLSearchParams");
    expect(TASK_EXPLANATIONS[13]).toContain("replaceState");
    expect(TASK_EXPLANATIONS[13]).toContain('Boolean("false")');

    // Articles & Resources
    expect(task?.articles).toBeDefined();
    expect(task?.articles?.length).toBeGreaterThanOrEqual(4);

    // Interviewer questions
    expect(task?.interviewerQuestions?.length).toBeGreaterThanOrEqual(4);

    // Checklist
    expect(task?.checklist?.length).toBeGreaterThanOrEqual(5);

    // Search and section inclusion
    const searchResults = await searchTasks("Синхронизация фильтров с URL", "react");
    expect(searchResults.some((t) => t.id === 13)).toBe(true);

    const reactTasks = await getTasksBySection("react");
    expect(reactTasks.some((t) => t.id === 13)).toBe(true);
  });

  it("should retrieve all 5 new React Middle tasks (id: 14 - 18) with complete metadata, solutions and explanations", async () => {
    // 14. Autocomplete Combobox
    const task14 = await getTaskById(14);
    expect(task14).toBeDefined();
    expect(task14?.id).toBe(14);
    expect(task14?.category).toBe("UI-компоненты и паттерны");
    expect(task14?.title).toContain("Автокомплит с клавиатурой");
    expect(task14?.rawCandidate).toContain("AutocompleteCombobox");
    expect(task14?.rawCandidate).toContain("role=\"combobox\"");
    expect(task14?.rawSolution).toContain("highlightedIndex");
    expect(task14?.rawSolution).toContain("ArrowDown");
    expect(task14?.rawSolution).toContain("handleSelect");
    expect(TASK_EXPLANATIONS[14]).toBeDefined();
    expect(TASK_EXPLANATIONS[14]).toContain("Combobox");

    // 15. Optimistic Like
    const task15 = await getTaskById(15);
    expect(task15).toBeDefined();
    expect(task15?.id).toBe(15);
    expect(task15?.category).toBe("UI-компоненты и паттерны");
    expect(task15?.title).toContain("Оптимистичные обновления");
    expect(task15?.rawCandidate).toContain("mockToggleLikeApi");
    expect(task15?.rawCandidate).toContain("OptimisticLike");
    expect(task15?.rawSolution).toContain("prevLiked");
    expect(task15?.rawSolution).toContain("prevCount");
    expect(task15?.rawSolution).toContain("disabled={isLoading}");
    expect(TASK_EXPLANATIONS[15]).toBeDefined();
    expect(TASK_EXPLANATIONS[15]).toContain("Optimistic UI");

    // 16. Shopping Cart
    const task16 = await getTaskById(16);
    expect(task16).toBeDefined();
    expect(task16?.id).toBe(16);
    expect(task16?.category).toBe("UI-компоненты и паттерны");
    expect(task16?.title).toContain("Корзина товаров и скидки");
    expect(task16?.rawCandidate).toContain("INITIAL_CART_ITEMS");
    expect(task16?.rawCandidate).toContain("ShoppingCart");
    expect(task16?.rawSolution).toContain("subtotal");
    expect(task16?.rawSolution).toContain("SAVE10");
    expect(task16?.rawSolution).toContain("SALE500");
    expect(task16?.rawSolution).toContain("delivery");
    expect(TASK_EXPLANATIONS[16]).toBeDefined();
    expect(TASK_EXPLANATIONS[16]).toContain("производное состояние");

    // 17. Compound Accordion
    const task17 = await getTaskById(17);
    expect(task17).toBeDefined();
    expect(task17?.id).toBe(17);
    expect(task17?.category).toBe("UI-компоненты и паттерны");
    expect(task17?.title).toContain("Аккордеон: Compound Components");
    expect(task17?.rawCandidate).toContain("Accordion");
    expect(task17?.rawCandidate).toContain("CompoundAccordionDemo");
    expect(task17?.rawSolution).toContain("AccordionContext");
    expect(task17?.rawSolution).toContain("AccordionItemContext");
    expect(task17?.rawSolution).toContain("Accordion.Item =");
    expect(TASK_EXPLANATIONS[17]).toBeDefined();
    expect(TASK_EXPLANATIONS[17]).toContain("Compound Components");

    // 18. Stopwatch with Laps
    const task18 = await getTaskById(18);
    expect(task18).toBeDefined();
    expect(task18?.id).toBe(18);
    expect(task18?.category).toBe("UI-компоненты и паттерны");
    expect(task18?.title).toContain("Секундомер с кругами");
    expect(task18?.rawCandidate).toContain("Stopwatch");
    expect(task18?.rawSolution).toContain("startTimeRef");
    expect(task18?.rawSolution).toContain("accumulatedTimeRef");
    expect(task18?.rawSolution).toContain("handleLap");
    expect(task18?.rawSolution).toContain("clearInterval");
    expect(TASK_EXPLANATIONS[18]).toBeDefined();
    expect(TASK_EXPLANATIONS[18]).toContain("Event Loop Drift");

    // Verify all exist in React section
    const reactTasks = await getTasksBySection("react");
    for (const id of [14, 15, 16, 17, 18]) {
      expect(reactTasks.some((t) => t.id === id), `Task ${id} should be present in react tasks`).toBe(true);
    }
  });
  it("should retrieve React lifecycle tasks (a4, a5) with Company X metadata", async () => {
    const taskA4 = await getTaskById("a4");
    expect(taskA4).toBeDefined();
    expect(taskA4?.id).toBe("a4");
    expect(taskA4?.section).toBe("react");
    expect(taskA4?.title).toContain("Company X");
    expect(TASK_EXPLANATIONS.a4).toBeDefined();
    expect(TASK_EXPLANATIONS.a4).toContain("React 19");

    const taskA5 = await getTaskById("a5");
    expect(taskA5).toBeDefined();
    expect(taskA5?.id).toBe("a5");
    expect(taskA5?.section).toBe("react");
    expect(taskA5?.title).toContain("Company X");
    expect(TASK_EXPLANATIONS.a5).toBeDefined();
    expect(TASK_EXPLANATIONS.a5).toContain("useLayoutEffect");

    const reactTasks = await getTasksBySection("react");
    expect(reactTasks.some((t) => t.id === "a4")).toBe(true);
    expect(reactTasks.some((t) => t.id === "a5")).toBe(true);
  });

  it("should retrieve all 26 Objects tasks with full metadata", async () => {
    const jsTasks = await getTasksBySection("javascript");
    const objectTasks = jsTasks.filter((t) => t.group === "Объекты");

    expect(objectTasks).toHaveLength(26);
    expect(objectTasks.map((t) => t.id)).toEqual([
      ...Array.from({ length: 13 }, (_, index) => `js${197 + index}`),
      "js170",
      "js210",
      "js211",
      "js216",
      "js217",
      "js222",
      "js223",
      "js224",
      "js225",
      "js228",
      "js246",
      "js247",
      "js248",
    ]);

    // Test specific tasks across tiers
    const task197 = await getTaskById("js197");
    expect(task197?.group).toBe("Объекты");
    expect(task197?.subgroup).toBe("Базовый синтаксис");
    expect(task197?.title).toContain("CRUD");

    const task202 = await getTaskById("js202");
    expect(task202?.group).toBe("Объекты");
    expect(task202?.subgroup).toBe("Манипуляции и Утилиты");
    expect(task202?.title).toContain("isEmpty");

    const task207 = await getTaskById("js207");
    expect(task207?.group).toBe("Объекты");
    expect(task207?.subgroup).toBe("Собеседования: Hard");
    expect(task207?.title).toContain("get / Lodash _.get");

    const task170 = await getTaskById("js170");
    expect(task170?.group).toBe("Объекты");
    expect(task170?.subgroup).toBe("Собеседования: Hard");
    expect(task170?.title).toContain("deepFreeze");

    const task210 = await getTaskById("js210");
    expect(task210?.group).toBe("Объекты");
    expect(task210?.subgroup).toBe("Собеседования: Hard");
    expect(task210?.title).toContain("deepClone");

    const task211 = await getTaskById("js211");
    expect(task211?.group).toBe("Объекты");
    expect(task211?.subgroup).toBe("Собеседования: Hard");
    expect(task211?.title).toContain("deepMerge");
  });

  it("should place Objects group strictly before Arrays in JavaScript tasks order", async () => {
    const jsTasks = await getTasksBySection("javascript");
    const groupsInOrder: string[] = [];

    jsTasks.forEach((t) => {
      const g = t.group || "";
      if (g && !groupsInOrder.includes(g)) {
        groupsInOrder.push(g);
      }
    });

    const objectsIndex = groupsInOrder.indexOf("Объекты");
    const arraysIndex = groupsInOrder.indexOf("Массивы");

    expect(objectsIndex).toBeGreaterThan(-1);
    expect(arraysIndex).toBeGreaterThan(-1);
    expect(objectsIndex).toBeLessThan(arraysIndex);
  });

  it("should have valid explanations for all React refactoring tasks (r1 - r17)", () => {
    for (let i = 1; i <= 17; i++) {
      const taskId = `r${i}`;
      const explanation = (TASK_EXPLANATIONS as Record<string, string>)[taskId];
      expect(explanation, `Explanation for ${taskId} should exist`).toBeDefined();
      expect(
        explanation.length,
        `Explanation for ${taskId} should not be empty`
      ).toBeGreaterThan(100);
      expect(explanation).toMatch(/(?:суть задачи|разбор задачи)/i);
    }
  });

  it("should properly load all React Warmup tasks (w1 - w31) with complete metadata and explanations", async () => {
    const reactTasks = await getTasksBySection("react");
    const warmupTasks = reactTasks.filter((t) => t.category === "Разминка");

    expect(warmupTasks.length).toBe(31);

    for (let i = 1; i <= 31; i++) {
      const taskId = `w${i}`;
      const task = await getTaskById(taskId);
      expect(task, `Task ${taskId} should exist in catalog`).toBeDefined();
      expect(task?.section).toBe("react");
      expect(task?.category).toBe("Разминка");
      expect(task?.difficulty).toBe("warm-up");
      expect(task?.candidate || task?.rawCandidate).toBeDefined();
      expect(task?.solution || task?.rawSolution).toBeDefined();
      expect(task?.checklist && task.checklist.length).toBeGreaterThanOrEqual(3);
      expect(task?.articles && task.articles.length).toBeGreaterThanOrEqual(1);
      expect(task?.interviewerQuestions && task.interviewerQuestions.length).toBeGreaterThanOrEqual(1);

      const explanation = (TASK_EXPLANATIONS as Record<string, string>)[taskId];
      expect(explanation, `Explanation for ${taskId} should exist`).toBeDefined();
      expect(explanation.length).toBeGreaterThan(50);
    }

    // Verify task w3 (Checkbox) has checkbox-related questions rather than useEffect
    const task3 = await getTaskById("w3");
    expect(task3?.interviewerQuestions?.[0].question).toContain("checked");

    // Verify tasks w19 and w21 have live interactive candidate components
    const task19 = await getTaskById("w19");
    const task21 = await getTaskById("w21");
    expect(task19?.candidate).toBeDefined();
    expect(task19?.isRaw).toBeFalsy();
    expect(task21?.candidate).toBeDefined();
    expect(task21?.isRaw).toBeFalsy();
    expect(task21?.rawSolution).toContain("React.memo");

    // Verify new tasks w25 - w31 specific implementations
    const task25 = await getTaskById("w25");
    expect(task25?.title).toContain("CRUD массива");
    expect(task25?.rawSolution).toContain(".filter");
    expect(task25?.rawSolution).toContain(".map");

    const task26 = await getTaskById("w26");
    expect(task26?.title).toContain("Поднятие состояния");
    expect(task26?.rawSolution).toContain("TabsContainer");

    const task27 = await getTaskById("w27");
    expect(task27?.title).toContain("Таймер и интервал");
    expect(task27?.rawSolution).toContain("setInterval");
    expect(task27?.rawSolution).toContain("clearInterval");

    const task28 = await getTaskById("w28");
    expect(task28?.title).toContain("Подписка на глобальные события");
    expect(task28?.rawSolution).toContain("addEventListener");
    expect(task28?.rawSolution).toContain("removeEventListener");

    const task29 = await getTaskById("w29");
    expect(task29?.title).toContain("Хранение значений между рендерами в useRef");
    expect(task29?.rawSolution).toContain("useRef");
    expect(task29?.rawSolution).toContain("timerRef.current");

    const task30 = await getTaskById("w30");
    expect(task30?.title).toContain("Вычисляемое состояние");
    expect(task30?.rawSolution).toContain(".reduce");

    const task31 = await getTaskById("w31");
    expect(task31?.title).toContain("useToggle");
    expect(task31?.rawSolution).toContain("useToggle");
  });

  it("should categorize state management and lifecycle/runtime tasks properly", async () => {
    const taskA1 = await getTaskById("a1");
    expect(taskA1?.category).toBe("Управление состоянием");

    const taskA4 = await getTaskById("a4");
    expect(taskA4?.category).toBe("Жизненный цикл и рантайм");
    expect(taskA4?.title).toContain("Порядок вызовов Render, Ref Callback и useEffect");

    const taskA5 = await getTaskById("a5");
    expect(taskA5?.category).toBe("Жизненный цикл и рантайм");
    expect(taskA5?.title).toContain("Порядок вызовов useLayoutEffect, useEffect и Cleanup");
  });
});


