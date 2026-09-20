import { describe, expect, it } from "vitest";
import ts from "typescript";
import { loadAllTaskSections, loadTaskSection } from "./task-catalog";
import { getTaskById, getAdjacentTasks, searchTasks } from "./taskRegistry";
import { getTaskSectionById, CURRICULUM_COUNTS } from "./curriculum-manifest";
import { SECTIONS_LIST } from "./sectionsConfig";
import { getTaskFiles, hasTaskVisualComponent } from "./taskFiles";
import { getTypeScriptGroupMeta, TYPESCRIPT_GROUP_CONFIG } from "../curriculum/typescript/data/group-config";

const titles = [
  "Первые аннотации",
  "Составные значения",
  "Опциональные и неизменяемые поля",
  "Роль пользователя",
  "Что за тип у переменной",
  "Перечисление способов",
  "Значение по ключу",
  "Универсальный доступ",
  "Пересечение возможностей",
  "Выборочная сборка",
  "Карта записей",
  "Исключение лишнего",
  "Проверенный пользователь",
  "Разбор функции",
  "Общий шаблон API",
  "Условный выбор",
  "Шаблонные строки",
  "Разные формы события",
  "Получение данных",
  "Иерархия сотрудников",
  "Перегрузка обработчика",
  "Подписка на события",
  "Глубокая настройка",
  "Единица измерения",
];

describe("TypeScript curriculum", () => {
  it("places the section immediately after JavaScript and preserves the supplied order", async () => {
    const sectionIds = SECTIONS_LIST.map(({ id }) => id);
    expect(sectionIds[sectionIds.indexOf("javascript") + 1]).toBe("typescript");
    const tasks = await loadTaskSection("typescript");
    expect(tasks).toHaveLength(24);
    expect(tasks).toHaveLength(CURRICULUM_COUNTS.typescript);
    expect(tasks.map(({ title }) => title)).toEqual(titles.map((title, i) => `${i + 1}. ${title}`));
    expect(tasks.map(({ id }) => id)).toEqual(titles.map((_, i) => `typescript-${i + 1}`));
    expect(new Set(tasks.map(({ group }) => group)).size).toBe(5);
    expect(getAdjacentTasks("typescript-6", tasks)).toEqual({
      prevTask: tasks[4],
      nextTask: tasks[6],
    });
  });

  it("keeps React TypeScript IDs and saved progress namespaces separate", async () => {
    expect(getTaskSectionById("ts-1")).toBe("react");
    expect(getTaskSectionById("ts-practice-1")).toBe("react");
    expect(getTaskSectionById("typescript-1")).toBe("typescript");
    expect((await getTaskById("typescript-24"))?.title).toContain("Единица измерения");
    const allTasks = await loadAllTaskSections();
    expect(allTasks.filter(({ section }) => section === "typescript")).toHaveLength(24);
    const ids = allTasks.map(({ id }) => String(id));
    expect(ids.filter((id) => id.startsWith("typescript-"))).toHaveLength(24);
    expect((await searchTasks("Подписка на события", "typescript"))[0]?.id).toBe("typescript-22");
  });

  it("provides editable .ts sources and complete task tabs", async () => {
    for (const task of await loadTaskSection("typescript")) {
      expect(task.desc).toBeTruthy();
      expect(task.explanation).toBeTruthy();
      expect(task.articles?.length).toBeGreaterThan(0);
      expect(task.questions?.length).toBeGreaterThan(0);
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
  }, 15000);

  it("configures distinct semantic accent colors for each curriculum group", () => {
    const groupNames = Object.keys(TYPESCRIPT_GROUP_CONFIG);
    expect(groupNames).toHaveLength(5);

    const colors = groupNames.map((name) => getTypeScriptGroupMeta(name).color);
    const backgrounds = groupNames.map((name) => getTypeScriptGroupMeta(name).bg);

    // Each group must have a unique color and background
    expect(new Set(colors).size).toBe(5);
    expect(new Set(backgrounds).size).toBe(5);

    // Verify expected semantic assignments
    expect(getTypeScriptGroupMeta("Основы типизации").color).toBe("var(--accent-blue)");
    expect(getTypeScriptGroupMeta("Обобщённые и составные типы").color).toBe("var(--accent-purple)");
    expect(getTypeScriptGroupMeta("Служебные типы").color).toBe("var(--accent-orange)");
    expect(getTypeScriptGroupMeta("Преобразования типов").color).toBe("var(--accent-cyan)");
    expect(getTypeScriptGroupMeta("Прикладные паттерны").color).toBe("var(--accent-green)");

    // Fallback for unknown group
    const fallback = getTypeScriptGroupMeta("Неизвестная группа");
    expect(fallback.color).toBe("var(--color-ts)");
  });
});
