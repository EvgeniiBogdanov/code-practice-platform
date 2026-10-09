import type { TypeTestReport } from "@/shared/lib/code-editor";
import { hashString } from "@/shared/lib/hash";

const STORAGE_KEY = "playground_type_tests_cache";
/** Bump when the checker changes in a way that can change a verdict. */
const CACHE_VERSION = 1;
const MAX_ENTRIES = 40;

let entries: Map<string, TypeTestReport> | null = null;

const keyOf = (taskId: string, testsHash: string, code: string): string =>
  `${CACHE_VERSION}:${taskId}:${testsHash}:${code.length}:${hashString(code)}`;

const load = (): Map<string, TypeTestReport> => {
  if (entries) return entries;
  entries = new Map();
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(stored)) {
      for (const item of stored) {
        if (Array.isArray(item) && typeof item[0] === "string") entries.set(item[0], item[1]);
      }
    }
  } catch {
    // A damaged cache is just an empty one.
  }
  return entries;
};

const persist = (map: Map<string, TypeTestReport>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...map]));
  } catch {
    // Storage is full or unavailable: the cache only speeds up the next load.
  }
};

/**
 * The verdict for exactly this solution and these tests, if it was checked before. A verdict is
 * a pure function of the code and the tests, so a hit shows the final state at once and the
 * check does not have to run again.
 */
export const getCachedReport = (
  taskId: string,
  testsHash: string,
  code: string
): TypeTestReport | null => load().get(keyOf(taskId, testsHash, code)) ?? null;

export const cacheReport = (
  taskId: string,
  testsHash: string,
  code: string,
  report: TypeTestReport
): void => {
  const map = load();
  const key = keyOf(taskId, testsHash, code);
  map.delete(key);
  map.set(key, report);
  for (const oldest of map.keys()) {
    if (map.size <= MAX_ENTRIES) break;
    map.delete(oldest);
  }
  persist(map);
};

/** For tests: forgets everything, in memory and in storage. */
export const clearTypeTestsCache = (): void => {
  entries = null;
  localStorage.removeItem(STORAGE_KEY);
};
