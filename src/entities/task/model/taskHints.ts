import type { SectionType, TaskHints } from "../types";

type HintsDictionary = Readonly<Record<string, TaskHints>>;

const HINT_LOADERS: Partial<Record<SectionType, () => Promise<HintsDictionary>>> = {
  algorithms: async () => (await import("../curriculum/algorithms/data/algoHints")).ALGO_HINTS,
  typescript: async () => (await import("../curriculum/typescript/data/tsHints")).TS_HINTS,
  javascript: async () =>
    (await import("../curriculum/javascript/data/javascriptHints")).JAVASCRIPT_HINTS,
  react: async () => (await import("../curriculum/react/data/reactHints")).REACT_HINTS,
};

/** Hints live in a separate chunk per section and are fetched on first use. */
export const loadTaskHints = async (
  section: SectionType,
  taskId: string | number
): Promise<TaskHints | null> => {
  const dictionary = await HINT_LOADERS[section]?.();
  return dictionary?.[String(taskId)] ?? null;
};
