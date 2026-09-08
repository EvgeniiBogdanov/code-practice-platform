export type JsTaskAlgorithm =
  | "basic"
  | "binary-search"
  | "bubble-sort"
  | "depth-first-search"
  | "euclidean-algorithm"
  | "hash-map"
  | "two-pointers";

const JS_TASK_ALGORITHM_BY_ID = {
  js_while_3: "basic",
  js_while_4: "basic",
  js_while_5: "euclidean-algorithm",
  js_while_6: "binary-search",
  js_while_7: "basic",
  js_while_8: "two-pointers",
  js5: "basic",
  js7: "bubble-sort",
  js96: "hash-map",
  js99: "hash-map",
  js196: "hash-map",
  js242: "hash-map",
  js133: "basic",
  js134: "basic",
  js135: "basic",
  js136: "basic",
  js137: "depth-first-search",
  js138: "depth-first-search",
  js139: "depth-first-search",
  js140: "depth-first-search",
  js141: "depth-first-search",
  js142: "depth-first-search",
  js143: "depth-first-search",
  js144: "depth-first-search",
  js145: "depth-first-search",
  js146: "depth-first-search",
  js147: "basic",
} as const satisfies Readonly<Record<string, JsTaskAlgorithm>>;

export const getJsTaskAlgorithm = (taskId: string | number): JsTaskAlgorithm | null =>
  JS_TASK_ALGORITHM_BY_ID[String(taskId) as keyof typeof JS_TASK_ALGORITHM_BY_ID] ?? null;
