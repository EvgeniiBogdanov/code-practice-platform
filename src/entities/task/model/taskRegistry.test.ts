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
  it("should retrieve React lifecycle tasks (a4, a5) with React 19 metadata", async () => {
    const taskA4 = await getTaskById("a4");
    expect(taskA4).toBeDefined();
    expect(taskA4?.id).toBe("a4");
    expect(taskA4?.section).toBe("react");
    expect(taskA4?.title).toContain("React 19");
    expect(TASK_EXPLANATIONS.a4).toBeDefined();
    expect(TASK_EXPLANATIONS.a4).toContain("React 19");

    const taskA5 = await getTaskById("a5");
    expect(taskA5).toBeDefined();
    expect(taskA5?.id).toBe("a5");
    expect(taskA5?.section).toBe("react");
    expect(taskA5?.title).toContain("React 19");
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
});

