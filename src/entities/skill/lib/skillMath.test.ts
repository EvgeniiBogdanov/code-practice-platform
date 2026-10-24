import { describe, expect, it } from "vitest";
import { getSkillById, getSkillTasks, getSkillTaskEntry } from "../config/skillCatalog";
import type { SkillProgressInput, SkillReviewInput, SkillTaskStatus } from "../types";
import { pickNextTask } from "./pickNextTask";
import { getSectionSkillDepths, getSkillUnlockCount } from "./skillGraph";
import { computeAllSkillStats, computeSkillStats, getSkillReadiness } from "./skillMastery";
import {
  getNextStepSkills,
  getSkillReasons,
  getWeakSkillRecommendations,
} from "./skillRecommendations";
import { getOverdueDays, getRetention, getTaskProgress } from "./taskEvidence";

const NOW = new Date(2026, 9, 22, 15).getTime();
const INTERVALS = [0, 1, 3, 7, 14, 30, 60];

const dayString = (offset: number): string => {
  const date = new Date(2026, 9, 22 + offset);
  const pad = (value: number): string => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const review = (
  stage: number,
  dueOffset: number,
  rating: SkillReviewInput["rating"] = "medium"
): SkillReviewInput => ({
  stage,
  intervalDays: INTERVALS[stage],
  dueDate: dayString(dueOffset),
  rating,
});

const progress = (
  statuses: Record<string, SkillTaskStatus> = {},
  reviews: Record<string, SkillReviewInput> = {},
  excluded: string[] = []
): SkillProgressInput => ({ statuses, reviews, excluded: new Set(excluded), now: NOW });

const entry = (taskId: string) => {
  const found = getSkillTaskEntry(taskId);
  if (!found) throw new Error(`${taskId} is not in the skill index`);
  return found;
};

const statsOf = (skillId: string, input: SkillProgressInput) => {
  const skill = getSkillById(skillId);
  if (!skill) throw new Error(`unknown skill ${skillId}`);
  return computeSkillStats(skill, input);
};

/** `js.this` in route order: js277, js148, js150, js151, js153, js278, js279. */
const THIS_TASKS = getSkillTasks("js.this").map((task) => task.id);

describe("task evidence", () => {
  it("counts overdue days from the due day, never below zero", () => {
    expect(getOverdueDays(dayString(-3), NOW)).toBe(3);
    expect(getOverdueDays(dayString(0), NOW)).toBe(0);
    expect(getOverdueDays(dayString(5), NOW)).toBe(0);
    expect(getOverdueDays("not-a-date", NOW)).toBe(0);
  });

  it("forgets half of the evidence after a full interval and never more", () => {
    expect(getRetention(0, 7)).toBe(1);
    expect(getRetention(7, 14)).toBe(0.75);
    expect(getRetention(14, 14)).toBe(0.5);
    expect(getRetention(140, 14)).toBe(0.5);
  });

  it("maps a task's status and review onto evidence and state", () => {
    const id = THIS_TASKS[0];
    const at = (statuses: Record<string, SkillTaskStatus>, reviews = {}, excluded: string[] = []) =>
      getTaskProgress(entry(id), progress(statuses, reviews, excluded));

    expect(at({})).toMatchObject({ state: "new", evidence: null });
    expect(at({ [id]: "unsolved" })).toMatchObject({ state: "unsolved", evidence: 0.1 });
    expect(at({ [id]: "solved" })).toMatchObject({ state: "learning", evidence: 0.5 });
    expect(at({ [id]: "solved" }, { [id]: review(3, 4) })).toMatchObject({
      state: "solid",
      evidence: 0.75,
    });
    expect(at({ [id]: "solved" }, { [id]: review(1, 1, "hard") })).toMatchObject({
      state: "hard",
      evidence: 0.4,
    });
    expect(at({ [id]: "solved" }, { [id]: review(4, -14) })).toMatchObject({
      state: "overdue",
      overdueDays: 14,
      evidence: 0.85 * 0.5,
      evidenceWithoutDecay: 0.85,
    });
    expect(at({ [id]: "solved" }, {}, [id])).toMatchObject({ state: "excluded", evidence: null });
  });
});

describe("skill mastery", () => {
  it("starts every skill at zero for a new user", () => {
    const stats = computeAllSkillStats(progress());
    expect([...stats.values()].every((skill) => skill.level === "new" && skill.mastery === 0)).toBe(
      true
    );
    expect(getSkillReadiness(stats)).toBe(0);
  });

  it("flags a skill as weak as soon as a task is marked unsolved", () => {
    const stats = statsOf("js.this", progress({ [THIS_TASKS[2]]: "unsolved" }));
    expect(stats).toMatchObject({ isWeak: true, state: "weak", unsolved: 1, started: 1 });
  });

  it("needs two started tasks before low quality makes a skill weak", () => {
    const [first, second] = THIS_TASKS;
    const hard = { [first]: review(1, 1, "hard"), [second]: review(1, 1, "hard") };

    expect(statsOf("js.this", progress({ [first]: "solved" }, hard)).isWeak).toBe(false);
    expect(
      statsOf("js.this", progress({ [first]: "solved", [second]: "solved" }, hard))
    ).toMatchObject({ isWeak: true, hard: 2, quality: 0.4 });
  });

  it("marks a skill as fading when overdue reviews cost it mastery", () => {
    const statuses = Object.fromEntries(THIS_TASKS.map((id) => [id, "solved" as const]));
    const reviews = Object.fromEntries(THIS_TASKS.map((id) => [id, review(5, -30)]));
    const stats = statsOf("js.this", progress(statuses, reviews));

    expect(stats).toMatchObject({ isFading: true, isWeak: false, state: "fading", overdue: 7 });
    expect(stats.masteryWithoutDecay).toBeCloseTo(0.95);
    expect(stats.mastery).toBeCloseTo(0.95 * 0.5);
  });

  it("leaves excluded tasks out of both the numerator and the denominator", () => {
    const [first, ...rest] = THIS_TASKS;
    const stats = statsOf(
      "js.this",
      progress({ [first]: "solved" }, { [first]: review(6, 30) }, rest)
    );
    expect(stats).toMatchObject({ total: 1, mastery: 1 });
  });

  it("grants «Мастер» only when likely interview tasks reached stage 4", () => {
    const statuses = Object.fromEntries(THIS_TASKS.map((id) => [id, "solved" as const]));
    const allSix = Object.fromEntries(THIS_TASKS.map((id) => [id, review(6, 30)]));
    expect(statsOf("js.this", progress(statuses, allSix)).level).toBe("master");

    const likely = getSkillTasks("js.this").find((task) => (task.probability ?? 0) >= 75);
    if (!likely) throw new Error("js.this needs a likely task for this test");
    const oneLow = { ...allSix, [likely.id]: review(3, 4) };
    const stats = statsOf("js.this", progress(statuses, oneLow));
    expect(stats.mastery).toBeGreaterThanOrEqual(0.9);
    expect(stats.level).toBe("confident");
  });

  it("weights readiness by how likely a skill comes up at an interview", () => {
    const statuses = Object.fromEntries(THIS_TASKS.map((id) => [id, "solved" as const]));
    const reviews = Object.fromEntries(THIS_TASKS.map((id) => [id, review(6, 30)]));
    const stats = computeAllSkillStats(progress(statuses, reviews));
    const readiness = getSkillReadiness(stats, "javascript");

    expect(readiness).toBeGreaterThan(0);
    expect(readiness).toBeLessThan(1 / 10);
    expect(getSkillReadiness(stats, "react")).toBe(0);
  });
});

describe("recommendations", () => {
  it("explains the mastery with the same counters it is computed from", () => {
    const [first, second, third] = THIS_TASKS;
    const stats = statsOf(
      "js.this",
      progress(
        { [first]: "unsolved", [second]: "unsolved", [third]: "solved" },
        { [third]: review(2, -6) }
      )
    );
    expect(getSkillReasons(stats).map((reason) => reason.text)).toEqual([
      "2 задачи отмечены «не решено»",
      "1 повтор просрочен, до 6 дней",
      "4 задачи не начаты",
    ]);
  });

  it("puts foundations first and redirects a weak skill to its weak prerequisite", () => {
    const proto = getSkillTasks("js.proto")[0].id;
    const stats = computeAllSkillStats(
      progress({ [proto]: "unsolved", [THIS_TASKS[0]]: "unsolved" })
    );
    const [top, ...rest] = getWeakSkillRecommendations(stats, 3);

    expect(top.skillId).toBe("js.this");
    expect(rest).toEqual([]);
    expect(getSkillUnlockCount("js.this")).toBeGreaterThan(getSkillUnlockCount("js.proto"));

    const onlyProto = getWeakSkillRecommendations(
      computeAllSkillStats(progress({ [proto]: "unsolved" })),
      3
    );
    expect(onlyProto).toMatchObject([{ skillId: "js.proto", viaSkillId: null }]);
  });

  it("names the weak skill a recommended prerequisite holds up", () => {
    const [first, second] = getSkillTasks("js.classes").map((task) => task.id);
    const proto = getSkillTasks("js.proto")[0].id;
    const stats = computeAllSkillStats(
      progress({ [first]: "unsolved", [second]: "unsolved", [proto]: "unsolved" })
    );
    const [top] = getWeakSkillRecommendations(stats, 3);
    expect(top).toMatchObject({ skillId: "js.proto", viaSkillId: "js.classes" });
    expect(top.reasons[0].text).toBe("На нём держится «Классы»");
  });

  it("starts a new user with the root skills in learning order", () => {
    const next = getNextStepSkills(computeAllSkillStats(progress()), 3).map((skill) => skill.id);
    expect(next).toEqual(["js.scope", "js.types", "js.loops"]);
  });

  it("prefers a skill already in progress as the next step", () => {
    const loops = getSkillTasks("js.loops")[0].id;
    const next = getNextStepSkills(computeAllSkillStats(progress({ [loops]: "solved" })), 1);
    expect(next.map((skill) => skill.id)).toEqual(["js.loops"]);
  });
});

describe("next task", () => {
  it("picks unsolved, then overdue, then hard, then new, then the least reinforced", () => {
    const [a, b, c, d] = THIS_TASKS;
    const pick = (statuses: Record<string, SkillTaskStatus>, reviews = {}) =>
      pickNextTask(statsOf("js.this", progress(statuses, reviews)))?.id;
    const allSolved = Object.fromEntries(THIS_TASKS.map((id) => [id, "solved" as const]));

    expect(pick({ [a]: "solved", [d]: "unsolved" }, { [b]: review(2, -2) })).toBe(d);
    expect(
      pick({ [a]: "solved", [b]: "solved" }, { [a]: review(1, 1, "hard"), [b]: review(2, -2) })
    ).toBe(b);
    expect(pick({ [a]: "solved" }, { [a]: review(1, 1, "hard") })).toBe(a);
    expect(pick({ [a]: "solved", [b]: "solved" })).toBe(c);

    const settled = Object.fromEntries(THIS_TASKS.map((id) => [id, review(5, 20)]));
    expect(pick(allSolved, { ...settled, [c]: review(3, 4) })).toBe(c);
    expect(pick(allSolved, settled)).toBeUndefined();
  });
});

describe("skill graph", () => {
  it("lays out a section by its longest prerequisite path", () => {
    const depths = getSectionSkillDepths("javascript");
    expect(depths.get("js.scope")).toBe(0);
    expect(depths.get("js.closures")).toBe(1);
    expect(depths.get("js.this")).toBe(2);
    expect(depths.get("js.proto")).toBe(3);
    expect(depths.get("js.classes")).toBe(4);
    // A prerequisite from JavaScript does not push an algorithm skill to the right.
    expect(getSectionSkillDepths("algorithms").get("algo.hash-map")).toBe(0);
  });
});
