export type JsTaskAlgorithm =
  | "basic"
  | "binary-search"
  | "bubble-sort"
  | "depth-first-search"
  | "euclidean-algorithm"
  | "hash-map"
  | "linked-list"
  | "two-pointers";

export const JS_ALGO_SUB_LABELS: Record<string, string> = {
  // Binary Search & Two Pointers
  js_while_6: "Binary Search: Classic",
  js_while_8: "Two Pointers: Classic",

  // Sorting & Linked List
  js7: "Sorting: Bubble Sort",
  js_while_7: "Linked List: Traversal",

  // Math
  js_while_5: "Math: Euclidean Algorithm",

  // Hash Map & Set
  js96: "Hash Map: Frequency",
  js99: "Hash Map: Grouping",
  js196: "Hash Map: Lookup",
  js242: "Hash Map: Lookup",
  js83: "Hash Map: Set",
  js241: "Hash Map: Memoization",

  // DFS: Bottom-Up
  js141: "DFS: Bottom-Up",
  js140: "DFS: Bottom-Up",
  js146: "DFS: Bottom-Up",
  js139: "DFS: Bottom-Up",
  js143: "DFS: Bottom-Up",

  // DFS: Traversal
  js137: "DFS: Traversal",
  js138: "DFS: Traversal",
  js142: "DFS: Traversal",
  js144: "DFS: Traversal",
  js145: "DFS: Traversal",
  js227: "DFS: Traversal",

  // Basic algorithms
  js_while_3: "Базовый алгоритм",
  js_while_4: "Базовый алгоритм",
  js5: "Базовый алгоритм",
  js133: "Базовый алгоритм",
  js134: "Базовый алгоритм",
  js135: "Базовый алгоритм",
  js136: "Базовый алгоритм",
  js147: "Базовый алгоритм",
};

const JS_TASK_ALGORITHM_BY_ID = {
  js_while_3: "basic",
  js_while_4: "basic",
  js_while_5: "euclidean-algorithm",
  js_while_6: "binary-search",
  js_while_7: "linked-list",
  js_while_8: "two-pointers",
  js5: "basic",
  js7: "bubble-sort",
  js83: "hash-map",
  js96: "hash-map",
  js99: "hash-map",
  js196: "hash-map",
  js241: "hash-map",
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
  js227: "depth-first-search",
} as const satisfies Readonly<Record<string, JsTaskAlgorithm>>;

export const getJsTaskAlgorithm = (taskId: string | number): JsTaskAlgorithm | null =>
  JS_TASK_ALGORITHM_BY_ID[String(taskId) as keyof typeof JS_TASK_ALGORITHM_BY_ID] ?? null;

export const getJsTaskAlgorithmSubLabel = (taskId: string | number): string | null =>
  JS_ALGO_SUB_LABELS[String(taskId)] ?? null;
