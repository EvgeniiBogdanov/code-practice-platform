import { describe, expect, it } from "vitest";
import { countCompletedStages, isCaseCompleted, isStageComplete } from "./stageProgress";
import type { DesignCase, DesignStage, StageProgress } from "./types";

const stage = (id: DesignStage["id"], drillIds: string[] = []): DesignStage => ({
  id,
  prompt: "p",
  forks: [{ id: "f", question: "q", options: [{ id: "a", label: "A", explanation: "e" }] }],
  notes: "n",
  rubric: ["one", "two"],
  drillIds,
  topicIds: [],
});

const done: StageProgress = { choices: { f: "a" }, rubric: [0, 1] };

const designCase: DesignCase = {
  id: "c",
  title: "C",
  difficulty: "easy",
  summary: "s",
  production: "p",
  stages: [stage("requirements"), stage("architecture", ["sd-1"])],
  scheme: { nodes: [], edges: [] },
};

describe("isStageComplete", () => {
  it("needs every fork answered and the whole rubric", () => {
    const s = stage("requirements");
    expect(isStageComplete(s, done)).toBe(true);
    expect(isStageComplete(s, { ...done, choices: {} })).toBe(false);
    expect(isStageComplete(s, { ...done, rubric: [0] })).toBe(false);
  });
});

describe("case completion", () => {
  const stages = { "c:requirements": done, "c:architecture": done };

  it("counts completed stages by case and stage id", () => {
    expect(countCompletedStages(designCase, {})).toBe(0);
    expect(countCompletedStages(designCase, { "c:requirements": done })).toBe(1);
    expect(countCompletedStages(designCase, { "other:requirements": done })).toBe(0);
  });

  it("is passed only when all stages are done and every linked drill is solved", () => {
    expect(isCaseCompleted(designCase, stages, () => true)).toBe(true);
    expect(isCaseCompleted(designCase, stages, () => false)).toBe(false);
    expect(isCaseCompleted(designCase, { "c:requirements": done }, () => true)).toBe(false);
  });
});
