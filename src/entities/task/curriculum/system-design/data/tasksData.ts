import type { Task } from "../../../types";
import { DRILL_GROUPS } from "./drills";

const sources = import.meta.glob<string>(
  ["../tasks/**/*.ts", "../solutions/**/*.ts", "../tests/**/*.ts", "../explanations/**/*.md"],
  { query: "?raw", import: "default", eager: true }
);

const readSource = (path: string): string => {
  const source = sources[path];
  if (source === undefined) throw new Error(`System design curriculum source not found: ${path}`);
  return source;
};

/** Code drills of the system design section; order is the learning path of the cases. */
export const SYSTEM_DESIGN_TASKS: readonly Task[] = DRILL_GROUPS.flatMap(({ name, drills }) =>
  drills.map(
    (drill): Task => ({
      ...drill,
      group: name,
      section: "system-design",
      isRaw: true,
      explanation: readSource(`../explanations/${drill.filepath.replace(/\.ts$/, ".md")}`),
      rawCandidate: readSource(`../tasks/${drill.filepath}`),
      rawSolution: readSource(`../solutions/${drill.filepath}`),
      rawTests: readSource(`../tests/${drill.filepath}`),
    })
  )
);
