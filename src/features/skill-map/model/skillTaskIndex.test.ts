// @vitest-environment node
import prettier from "prettier";
import { beforeAll, describe, expect, it } from "vitest";
import { loadAllTaskSections } from "@/entities/task/catalog";
import {
  getAlgoTaskProbability,
  getJsTaskProbability,
  getReactGroupId,
  type Task,
} from "@/entities/task";
import {
  SKILLS,
  SKILL_SECTIONS,
  findSkillCycle,
  getSkillById,
  type SkillStepMatch,
  type SkillTaskEntry,
} from "@/entities/skill";

// Run `npm run generate:skill-index` after changing the curriculum or the skill config.
const INDEX_PATH = "../../../entities/skill/config/skillTaskIndex.json";

/** Skills allowed below the 3-task floor: visible content debt, never a new entry without a task plan. */
const SMALL_SKILLS = new Set(["js.classes"]);

const matchesStep = (task: Task, match: SkillStepMatch): boolean =>
  "taskIds" in match
    ? match.taskIds.includes(String(task.id))
    : task.group === match.group &&
      (!match.subgroups || match.subgroups.includes(task.subgroup ?? ""));

const getProbability = (task: Task): number | null =>
  task.section === "javascript"
    ? getJsTaskProbability(task)
    : task.section === "algorithms"
      ? getAlgoTaskProbability(task)
      : null;

/** React groups are keyed by id; the other sections by the group name their config uses. */
const getGroupKey = (task: Task): string | null =>
  task.section === "react" ? (getReactGroupId(task) ?? null) : (task.group ?? null);

const toEntry = (task: Task, skill: string, step: number): SkillTaskEntry => ({
  id: String(task.id),
  skill,
  step,
  group: getGroupKey(task),
  difficulty: task.difficulty ?? null,
  probability: getProbability(task),
  title: task.title,
});

const buildIndex = (tasks: readonly Task[]): SkillTaskEntry[] =>
  SKILLS.flatMap((skill) =>
    skill.steps.flatMap(({ match }, step) => {
      const sectionTasks = tasks.filter((task) => task.section === skill.section);
      // Hand-picked steps keep their listed order: for algorithms it is the learning chain.
      const matched =
        "taskIds" in match
          ? match.taskIds.flatMap((id) => sectionTasks.filter((task) => String(task.id) === id))
          : sectionTasks.filter((task) => matchesStep(task, match));
      return matched.map((task) => toEntry(task, skill.id, step));
    })
  );

describe("skill taxonomy", () => {
  let tasks: Task[] = [];
  let index: SkillTaskEntry[] = [];

  beforeAll(async () => {
    // Sections without a skill map (system design) have no skills to place their tasks into.
    tasks = (await loadAllTaskSections()).filter(
      (task) => !task.isGroupOverview && SKILL_SECTIONS.some((section) => section === task.section)
    );
    index = buildIndex(tasks);
  });

  it("places every task into exactly one skill", () => {
    const counts = new Map<string, number>();
    index.forEach((entry) => counts.set(entry.id, (counts.get(entry.id) ?? 0) + 1));

    const missing = tasks.filter((task) => !counts.has(String(task.id)));
    const repeated = [...counts].filter(([, count]) => count > 1).map(([id]) => id);

    expect(
      missing.map((task) => `${task.id} (${task.section} / ${task.group} / ${task.subgroup})`),
      "add these tasks to a skill in entities/skill/config"
    ).toEqual([]);
    expect(repeated, "a task may belong to one skill only").toEqual([]);
  });

  it("matches at least one task with every step", () => {
    const empty = SKILLS.flatMap((skill) =>
      skill.steps
        .filter(
          (_, step) => !index.some((entry) => entry.skill === skill.id && entry.step === step)
        )
        .map((step) => `${skill.id} → ${step.title}`)
    );
    expect(empty).toEqual([]);
  });

  it("lists only existing tasks of the skill's own section by id", () => {
    const unknown = SKILLS.flatMap((skill) =>
      skill.steps.flatMap(({ match }) =>
        "taskIds" in match
          ? match.taskIds.filter(
              (id) =>
                !tasks.some((task) => String(task.id) === id && task.section === skill.section)
            )
          : []
      )
    );
    expect(unknown).toEqual([]);
  });

  it("keeps skill ids unique and prerequisites resolvable and acyclic", () => {
    expect(new Set(SKILLS.map((skill) => skill.id)).size).toBe(SKILLS.length);
    const unresolved = SKILLS.flatMap((skill) =>
      skill.requires.filter((id) => !getSkillById(id) || id === skill.id)
    );
    expect(unresolved).toEqual([]);
    expect(findSkillCycle()).toBeNull();
  });

  it("gives every skill at least three tasks unless it is allow-listed", () => {
    const small = SKILLS.filter(
      (skill) =>
        !SMALL_SKILLS.has(skill.id) && index.filter((entry) => entry.skill === skill.id).length < 3
    ).map((skill) => skill.id);
    expect(small).toEqual([]);
  });

  it("ships an index generated from the current curriculum", async () => {
    const options = await prettier.resolveConfig(new URL(INDEX_PATH, import.meta.url));
    const json = await prettier.format(JSON.stringify(index), { ...options, parser: "json" });

    await expect(json).toMatchFileSnapshot(INDEX_PATH);
  });
});
