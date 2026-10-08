import type { TaskHints } from "../../../types";
import { INTERVIEW_HINTS } from "./hints/interviewHints";
import { LIFECYCLE_HINTS } from "./hints/lifecycleHints";
import { REACT_TYPESCRIPT_HINTS } from "./hints/typescriptHints";
import { REFACTORING_HINTS } from "./hints/refactoringHints";
import { STATE_HINTS } from "./hints/stateHints";
import { WARMUP_HINTS } from "./hints/warmupHints";

/**
 * Three progressive hints per React task: [idea, pitfalls, plan].
 * Hook-syntax and trivial warm-ups (basic useState/useEffect/useRef/useMemo/useCallback syntax,
 * a plain counter, a search input, a checkbox, form submit, simple filters, focus via ref)
 * deliberately have none. For "what will it print" tasks the hints describe how to reason
 * and never reveal the output.
 */
export const REACT_HINTS: Readonly<Record<string, TaskHints>> = {
  ...WARMUP_HINTS,
  ...REFACTORING_HINTS,
  ...INTERVIEW_HINTS,
  ...STATE_HINTS,
  ...REACT_TYPESCRIPT_HINTS,
  ...LIFECYCLE_HINTS,
};
