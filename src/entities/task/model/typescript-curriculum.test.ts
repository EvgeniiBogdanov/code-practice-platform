import { describe, expect, it } from "vitest";
import ts from "typescript";
import { loadAllTaskSections, loadTaskSection } from "./task-catalog";
import { getTaskById, getAdjacentTasks, searchTasks } from "./taskRegistry";
import { getTaskSectionById, CURRICULUM_COUNTS } from "./curriculum-manifest";
import { SECTIONS_LIST } from "./sectionsConfig";
import { getTaskFiles, hasTaskVisualComponent } from "./taskFiles";
import {
  getTypeScriptGroupMeta,
  TYPESCRIPT_GROUP_CONFIG,
} from "../curriculum/typescript/data/group-config";

const GROUP_ORDER = [
  "Основы TypeScript",
  "Type Narrowing",
  "Generics",
  "Utility Types",
  "Mapped и Conditional Types",
  "Практические паттерны",
  "Advanced Types",
];

describe("TypeScript curriculum", () => {
  it("places the section immediately after JavaScript and numbers tasks by position", async () => {
    const sectionIds = SECTIONS_LIST.map(({ id }) => id);
    expect(sectionIds[sectionIds.indexOf("javascript") + 1]).toBe("typescript");
    const tasks = await loadTaskSection("typescript");
    expect(tasks).toHaveLength(54);
    expect(tasks).toHaveLength(CURRICULUM_COUNTS.typescript);
    tasks.forEach(({ title }, i) => expect(title).toMatch(new RegExp(`^${i + 1}\\. \\S`)));
    expect(getAdjacentTasks(String(tasks[5].id), tasks)).toEqual({
      prevTask: tasks[4],
      nextTask: tasks[6],
    });
  });

  it("keeps groups contiguous, ordered from basics to advanced and graded by difficulty", async () => {
    const tasks = await loadTaskSection("typescript");
    const groupSequence = tasks
      .map(({ group }) => group)
      .filter((group, i, all) => i === 0 || group !== all[i - 1]);
    expect(groupSequence).toEqual(GROUP_ORDER);
    expect(tasks[0].difficulty).toBe("easy");
    expect(tasks.at(-1)?.difficulty).toBe("hard");
    expect(
      tasks
        .filter(({ group }) => group === "Advanced Types")
        .every(({ difficulty }) => difficulty === "hard")
    ).toBe(true);
  });

  it("preserves the IDs of previously published tasks so saved progress stays valid", async () => {
    const ids = (await loadTaskSection("typescript")).map(({ id }) => String(id));
    expect(new Set(ids).size).toBe(ids.length);
    for (let i = 1; i <= 24; i += 1) expect(ids).toContain(`typescript-${i}`);
  });

  it("keeps React TypeScript IDs and saved progress namespaces separate", async () => {
    expect(getTaskSectionById("ts-1")).toBe("react");
    expect(getTaskSectionById("ts-practice-1")).toBe("react");
    expect(getTaskSectionById("typescript-1")).toBe("typescript");
    expect((await getTaskById("typescript-24"))?.title).toContain("Брендированные идентификаторы");
    const allTasks = await loadAllTaskSections();
    expect(allTasks.filter(({ section }) => section === "typescript")).toHaveLength(54);
    const ids = allTasks.map(({ id }) => String(id));
    expect(ids.filter((id) => id.startsWith("typescript-"))).toHaveLength(54);
    expect((await searchTasks("Подписка на события", "typescript"))[0]?.id).toBe("typescript-22");
  });

  it("provides editable .ts sources and complete task tabs", async () => {
    for (const task of await loadTaskSection("typescript")) {
      expect(task.desc).toBeTruthy();
      expect(task.explanation).toBeTruthy();
      expect(task.articles?.length).toBeGreaterThan(0);
      expect(task.questions?.length).toBeGreaterThanOrEqual(3);
      expect(task.checklist?.length).toBeGreaterThan(0);
      const files = getTaskFiles(task);
      expect(files[0].name).toMatch(/\.ts$/);
      expect(files[0].code).toBe(task.rawCandidate);
      expect(getTaskFiles(task, "solution")[0].code).toBe(task.rawSolution);
      expect(hasTaskVisualComponent(task, files)).toBe(false);
    }
  });

  it("typechecks every reference solution in strict mode with the standard library", async () => {
    const tasks = await loadTaskSection("typescript");
    const program = ts.createProgram(
      tasks.map(
        (task) => `src/entities/task/curriculum/typescript/solutions/${task.filepath ?? ""}`
      ),
      {
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        moduleDetection: ts.ModuleDetectionKind.Force,
        types: [],
      }
    );
    const diagnostics = ts.getPreEmitDiagnostics(program);
    expect(
      diagnostics.map(
        (item) =>
          `${item.file?.fileName}: ${ts.flattenDiagnosticMessageText(item.messageText, "\n")}`
      )
    ).toEqual([]);
  }, 30000);

  it("configures distinct semantic accent colors for each curriculum group", () => {
    const groupNames = Object.keys(TYPESCRIPT_GROUP_CONFIG);
    expect(groupNames).toEqual(GROUP_ORDER);

    const colors = groupNames.map((name) => getTypeScriptGroupMeta(name).color);
    const backgrounds = groupNames.map((name) => getTypeScriptGroupMeta(name).bg);

    // Each group must have a unique color and background
    expect(new Set(colors).size).toBe(GROUP_ORDER.length);
    expect(new Set(backgrounds).size).toBe(GROUP_ORDER.length);

    // Verify expected semantic assignments
    expect(getTypeScriptGroupMeta("Основы TypeScript").color).toBe("var(--accent-blue)");
    expect(getTypeScriptGroupMeta("Generics").color).toBe("var(--accent-purple)");
    expect(getTypeScriptGroupMeta("Utility Types").color).toBe("var(--accent-orange)");
    expect(getTypeScriptGroupMeta("Mapped и Conditional Types").color).toBe("var(--accent-cyan)");
    expect(getTypeScriptGroupMeta("Практические паттерны").color).toBe("var(--accent-green)");
    expect(getTypeScriptGroupMeta("Type Narrowing").color).toBe("var(--accent-pink)");
    expect(getTypeScriptGroupMeta("Advanced Types").color).toBe("var(--accent-red)");

    // Fallback for unknown group
    const fallback = getTypeScriptGroupMeta("Неизвестная группа");
    expect(fallback.color).toBe("var(--color-ts)");
  });
});
