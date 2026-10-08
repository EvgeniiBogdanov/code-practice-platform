import type { TaskHints } from "../../../types";
import { ARRAYS_HINTS } from "./hints/arraysHints";
import { ASYNC_HINTS } from "./hints/asyncHints";
import { COLLECTIONS_HINTS } from "./hints/collectionsHints";
import { FUNCTIONS_HINTS } from "./hints/functionsHints";
import { ITERATORS_HINTS } from "./hints/iteratorsHints";
import { LOOPS_HINTS } from "./hints/loopsHints";
import { OBJECTS_HINTS } from "./hints/objectsHints";
import { PATTERNS_HINTS } from "./hints/patternsHints";
import { RECURSION_HINTS } from "./hints/recursionHints";
import { SCOPE_HINTS } from "./hints/scopeHints";
import { STRINGS_HINTS } from "./hints/stringsHints";
import { THIS_HINTS } from "./hints/thisHints";
import { TYPES_HINTS } from "./hints/typesHints";
import { UTILS_HINTS } from "./hints/utilsHints";

/**
 * Three progressive hints per JavaScript task: [idea, pitfalls, plan].
 * Only tasks with an idea, a trap or an algorithm have hints; basic syntax drills
 * (loop syntax, simple array/Set/Map calls, basic timers and promises) deliberately have none.
 * For "what will it print" tasks the hints describe how to reason and never reveal the output.
 * The legacy `jsHints.js` only feeds the explanation tab and is a different format.
 */
export const JAVASCRIPT_HINTS: Readonly<Record<string, TaskHints>> = {
  ...SCOPE_HINTS,
  ...TYPES_HINTS,
  ...LOOPS_HINTS,
  ...OBJECTS_HINTS,
  ...ARRAYS_HINTS,
  ...STRINGS_HINTS,
  ...COLLECTIONS_HINTS,
  ...FUNCTIONS_HINTS,
  ...RECURSION_HINTS,
  ...THIS_HINTS,
  ...ITERATORS_HINTS,
  ...ASYNC_HINTS,
  ...PATTERNS_HINTS,
  ...UTILS_HINTS,
};
