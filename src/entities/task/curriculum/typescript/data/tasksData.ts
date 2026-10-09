import type { Task } from "../../../types";
import { hashString } from "@/shared/lib/hash";
import type { LinkedChecklistItem, TypeScriptTaskGroup } from "./taskMeta";
import { BASICS_GROUP } from "./groups/basics";
import { NARROWING_GROUP } from "./groups/narrowing";
import { GENERICS_GROUP } from "./groups/generics";
import { UTILITY_TYPES_GROUP } from "./groups/utilityTypes";
import { TYPE_TRANSFORMATIONS_GROUP } from "./groups/typeTransformations";
import { APPLICATION_PATTERNS_GROUP } from "./groups/applicationPatterns";
import { ADVANCED_TYPES_GROUP } from "./groups/advancedTypes";

const sources = import.meta.glob<string>(
  ["../tasks/**/*.ts", "../solutions/**/*.ts", "../tests/**/*.ts", "../explanations/**/*.md"],
  { query: "?raw", import: "default", eager: true }
);

const readSource = (path: string): string => {
  const source = sources[path];
  if (source === undefined) throw new Error(`TypeScript curriculum source not found: ${path}`);
  return source;
};

// Order of groups and of tasks inside them is the learning path: from junior to senior.
export const TYPESCRIPT_GROUPS: readonly TypeScriptTaskGroup[] = [
  BASICS_GROUP,
  NARROWING_GROUP,
  GENERICS_GROUP,
  UTILITY_TYPES_GROUP,
  TYPE_TRANSFORMATIONS_GROUP,
  APPLICATION_PATTERNS_GROUP,
  ADVANCED_TYPES_GROUP,
];

const isLinked = (item: string | LinkedChecklistItem): item is LinkedChecklistItem =>
  typeof item !== "string";

export const TYPESCRIPT_TASKS: Task[] = TYPESCRIPT_GROUPS.flatMap(({ name, tasks }) =>
  tasks.map((task) => ({ ...task, group: name }))
).map(({ checklist, ...task }, index) => {
  const rawTests = readSource(`../tests/${task.filepath}`);
  return {
    ...task,
    title: `${index + 1}. ${task.title}`,
    section: "typescript",
    isRaw: true,
    checklist: checklist.map((item) => (isLinked(item) ? item.text : item)),
    checklistTests: Object.fromEntries(
      checklist.flatMap((item, i) => (isLinked(item) ? [[i, item.tests]] : []))
    ),
    explanation: readSource(`../explanations/${task.filepath.replace(/\.ts$/, ".md")}`),
    rawCandidate: readSource(`../tasks/${task.filepath}`),
    rawSolution: readSource(`../solutions/${task.filepath}`),
    rawTests,
    testsHash: hashString(rawTests),
  };
});
