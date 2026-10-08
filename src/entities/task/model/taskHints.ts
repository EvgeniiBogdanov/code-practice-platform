import type { SectionType, TaskHints } from "../types";

type HintsDictionary = Readonly<Record<string, TaskHints>>;

const HINT_LOADERS: Partial<Record<SectionType, () => Promise<HintsDictionary>>> = {
  algorithms: async () => (await import("../curriculum/algorithms/data/algoHints")).ALGO_HINTS,
  typescript: async () => (await import("../curriculum/typescript/data/tsHints")).TS_HINTS,
  javascript: async () =>
    (await import("../curriculum/javascript/data/javascriptHints")).JAVASCRIPT_HINTS,
  react: async () => (await import("../curriculum/react/data/reactHints")).REACT_HINTS,
};

const loadedDictionaries = new Map<SectionType, HintsDictionary>();

/** Hints live in a separate chunk per section and are fetched once, on first use. */
export const preloadTaskHints = async (section: SectionType): Promise<void> => {
  if (loadedDictionaries.has(section)) return;
  const dictionary = await HINT_LOADERS[section]?.();
  if (dictionary) loadedDictionaries.set(section, dictionary);
};

/**
 * Hints of a task without waiting: `undefined` while the section's chunk is not loaded yet,
 * `null` when the task has no hints. Lets a task page render its hints in the very first frame.
 */
export const peekTaskHints = (
  section: SectionType,
  taskId: string | number
): TaskHints | null | undefined => {
  const dictionary = loadedDictionaries.get(section);
  return dictionary ? (dictionary[String(taskId)] ?? null) : undefined;
};

export const loadTaskHints = async (
  section: SectionType,
  taskId: string | number
): Promise<TaskHints | null> => {
  await preloadTaskHints(section);
  return peekTaskHints(section, taskId) ?? null;
};
