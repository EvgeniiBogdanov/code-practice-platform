import type { MetaBadgeVariant } from "@/shared/ui";
import type { Task } from "../types";

export interface TaskProbabilityInfo {
  probability: number | null;
  variant: MetaBadgeVariant;
  label: string;
  tooltip: string;
}

export const isSyntaxTask = (title: string): boolean => {
  const t = (title || "").toLowerCase();
  return (
    t.includes("синтаксис") ||
    t.includes("базовый синтаксис") ||
    t.includes("базовый пример") ||
    t.includes("деструктуризация") ||
    t.includes("создание, чтение, запись") ||
    t.includes("создание set") ||
    t.includes("создание map") ||
    t.includes("создание promise") ||
    t.includes("базовый async/await") ||
    t.includes("что такое база рекурсии") ||
    t.includes("базовый вывод") ||
    t.includes("базовый интервал") ||
    t.includes("finally") ||
    t.includes("reject и catch") ||
    t.includes("цепочка then") ||
    t.includes("crud & computed keys")
  );
};

export const getProbabilityBadgeVariant = (probability: number): MetaBadgeVariant => {
  if (probability >= 75) return "green";
  if (probability >= 50) return "yellow";
  if (probability >= 25) return "orange";
  return "gray";
};

export const getProbabilityBadgeLabel = (probability: number): string => {
  return `Вероятность: ${Math.round(probability)}%`;
};

export const getProbabilityBadgeTitle = (probability: number): string => {
  const p = Math.round(probability);
  if (p >= 90) return `Вероятность на Middle/Senior: ${p}% (Критически высокая — стандарт live coding)`;
  if (p >= 75) return `Вероятность на Middle/Senior: ${p}% (Высокая — частый вопрос)`;
  if (p >= 50) return `Вероятность на Middle/Senior: ${p}% (Умеренная — практическая задача)`;
  return `Вероятность на Middle/Senior: ${p}% (Низкая — элементарная разминка)`;
};

/**
 * 2026 Frontend Interview Probability Map (Middle -> Senior Spectrum)
 * Focuses strictly on Middle, Middle+ and Senior engineering hiring bars.
 */
const TASK_PROBABILITY_OVERRIDES: Readonly<Record<string, number>> = {
  // === Middle+ / Senior Live Coding Staples (92-99%) ===
  js70: 99, // Debounce (leading, trailing, cancel)
  js165: 97, // Throttle
  js122: 96, // Async debounce with race condition cancellation
  js158: 98, // Promise.all polyfill with iterables & non-promise values
  js159: 96, // Promise.allSettled polyfill
  js160: 93, // Promise.race & Promise.any polyfills
  js171: 98, // EventEmitter / PubSub (once, unsubscribe, error handling)
  js218: 98, // deepClone with circular references (WeakMap) & Symbol keys
  js138: 96, // deepClone recursive
  js219: 96, // deepEqual with nested structures, Maps, Sets, Dates
  js220: 95, // deepMerge
  js137: 97, // Array flatten deep (recursive & iterative stack)
  js66: 96, // Array.prototype.flat / flatMap polyfills
  js63: 97, // Array.prototype.reduce polyfill
  js61: 95, // Array.prototype.map polyfill
  js62: 95, // Array.prototype.filter polyfill
  js221: 97, // Function.prototype.myBind (new-binding & currying support)
  js229: 94, // customNew (emulating `new` operator mechanics)
  js230: 93, // customInstanceOf (prototype chain traversal)

  // === Concurrency, Async Control & Cancellation (92-98%) ===
  js116: 98, // Concurrency pool (p-limit, parallel promise limiter)
  js121: 97, // Async task queue with priority & concurrency
  js115: 96, // Retry with exponential backoff & jitter
  js120: 95, // AbortController cancelable promises
  js117: 94, // Memoize async function with deduplication
  js114: 93, // Promisify callback-based functions
  js109: 92, // Sequential async loop execution (for await / reduce)
  js110: 92, // Promise.all complex usage
  js111: 90, // Promise.allSettled usage
  js112: 91, // Promise.race timeout pattern
  js113: 88, // Promise.any usage
  js108: 82, // try/catch with async/await

  // === Event Loop, Microtasks & Browser Engine (92-99%) ===
  js118: 99, // microtask vs macrotask execution order
  js185: 98, // Promise chain ordering & microtask queue
  js182: 98, // Complex macro and microtask mix
  js179: 97, // Nested promises vs async/await
  js174: 96, // Promise constructor & .then microtask scheduling
  js175: 96, // IIFE, Promise, Microtasks
  js180: 94, // Timers & microtask interactions
  js181: 92, // requestAnimationFrame vs Event Loop rendering
  js74: 95, // Closures in loops (var vs let, execution context)
  js73: 88, // Closures scope output
  js72: 84, // Nested setTimeout output
  js75: 78, // Timeout cleanup
  js77: 75, // Custom timer implementation
  js79: 76, // Interval with delay
  js80: 76, // Interval accumulation

  // === Path Resolution & Object Utilities (88-97%) ===
  js224: 97, // Lodash get (deep path resolver 'a.b[0].c')
  js225: 95, // Lodash set (deep path modifier)
  js227: 94, // flattenObject
  js228: 92, // unflattenObject
  js222: 88, // Lodash pick
  js223: 88, // Lodash omit
  js226: 85, // camelCase <-> snake_case keys converter
  js217: 88, // structuredClone polyfill
  js202: 84, // deepFreeze

  // === Closures & Functional Architecture (90-97%) ===
  js156: 97, // Infinite currying: add(1)(2)(3)...
  js155: 95, // Currying (auto-curry based on fn.length)
  js157: 94, // Hybrid sum: sum(1,2)(3) / sum(1)(2,3)
  js166: 94, // Pipe and Compose
  js101: 97, // Memoization with LRU / argument hashing
  js100: 95, // Memoize with TTL (cache invalidation)
  js94: 91, // Map-based memoization
  js125: 94, // Once function wrapper
  js128: 88, // Call limiter
  js126: 86, // After wrapper
  js127: 86, // Before wrapper
  js123: 88, // Counter with private closure
  js130: 87, // Method chaining pattern
  js124: 82, // Unique ID generator
  js129: 80, // Bank account encapsulation

  // === Algorithms, Two Pointers & Tree Recursion (85-95%) ===
  js213: 95, // Two Sum (O(N) with Hash Map)
  js99: 95, // Anagrams via Map
  js212: 94, // Group Anagrams
  js_while_8: 94, // Merge two sorted arrays (Two Pointers)
  js211: 92, // Merge K sorted arrays
  js140: 94, // Binary tree traversal (DFS)
  js141: 93, // Binary tree max depth
  js145: 92, // Tree nodes collector
  js146: 92, // Tree nodes sum
  js139: 92, // Sum in nested object
  js143: 90, // Recursive sum in arbitrary object
  js144: 91, // Collect primitives from deep tree
  js142: 90, // File search in directory tree
  js5: 86, // Palindrome (Two Pointers)
  js_while_6: 85, // Binary search
  js215: 86, // Find missing number
  js214: 82, // Peak element binary search
  js147: 75, // Fibonacci Nth number (Memo/DP)

  // === JS Core, Type Coercion & Prototypes (85-96%) ===
  js186: 96, // Type Coercion edge cases
  js187: 93, // Reference types & mutation traps
  js188: 92, // Object.is, || vs ??
  js148: 96, // Context loss, arrow fns & bind
  js150: 93, // Extract method to variable
  js151: 92, // Repeated bind
  js153: 90, // Call method with changed context
  js154: 88, // 'in' vs hasOwnProperty vs hasOwn
  js149: 86, // Prototype constructor overwrite
  js152: 85, // Prototype by reference
  js231: 82, // Classes & OOP private fields (#)

  // === Strings, Patterns, DOM Utilities (80-91%) ===
  js178: 90, // ClassNames Polyfill
  js177: 88, // URL Query String parser & serializer
  js173: 91, // Reactive Signal / Observable
  js176: 85, // Template engine
  js245: 84, // String.prototype.replaceAll polyfill
  js243: 82, // Unicode reverse (surrogate pairs)
  js244: 75, // Lexer tokenization

  // === Sets & Maps (78-90%) ===
  js83: 90, // Set deduplication
  js86: 88, // Set intersection
  js87: 85, // Set union
  js88: 85, // Set difference
  js84: 82, // Set unique elements
  js85: 82, // Set unique items
  js93: 88, // Grouping by property via Map
  js97: 90, // Word frequency count via Map
  js183: 82, // WeakMap for private data & DOM cache
  js184: 78, // WeakSet for visited references

  // === Polyfills (Standard) & Chunks (75-88%) ===
  js67: 88, // Array chunk
  js60: 78, // Array.prototype.forEach polyfill
  js64: 85, // Array.prototype.find / findIndex polyfill
  js65: 86, // Array.prototype.some / every polyfill
  js68: 72, // Fisher-Yates shuffle
  js_while_7: 65, // Sum linked list
  js194: 55, // isEmptyObject
  js195: 50, // invertObject

  // === Elementary / Junior-level Practice (Drop to 5-25% for Middle/Senior) ===
  js2: 5, // Print 1 to N
  js4: 5, // Print evens
  js10: 5, // Print positives
  js_while_2: 6, // Countdown
  js3: 8, // Sum 1 to N
  js6: 10, // Sum array
  js9: 10, // Sum array for of
  js11: 12, // Includes check
  js12: 12, // Filter by length
  js192: 15, // Multiply numeric by 2
  js191: 16, // Count props
  js_while_3: 18, // Sum digits
  js133: 18, // Recursion base
  js135: 18, // Math pow recursion
  js136: 18, // Max in array recursion
  js_while_4: 20, // Reverse number
  js190: 20, // Sum salaries
  js7: 22, // Bubble sort
  js_while_5: 22, // GCD Euclid
  js193: 25, // Get own values
};

const inferFallbackProbability = (group: string, subgroup: string, title: string): number => {
  const t = title.toLowerCase();
  const g = group || "";
  const s = subgroup || "";

  if (s === "Полифилы" || t.includes("полифил")) return 92;
  if (g === "Паттерны проектирования" || s.includes("паттерн")) return 92;
  if (s === "Контроль частоты" || t.includes("debounce") || t.includes("throttle")) return 96;
  if (g === "Асинхронность" || s === "Event Loop") return 90;
  if (s === "Каррирование" || s === "Кеширование и мемоизация") return 94;
  if (g === "Прототипы THIS") return 88;
  if (g === "Рекурсия") return 88;
  if (g === "Объекты" && (t.includes("глубок") || t.includes("lodash"))) return 92;
  if (g === "Массивы" && s === "reduce") return 85;
  if (g === "Коллекции" && (s === "Map" || s === "Set")) return 82;
  if (t.includes("поиск") || t.includes("палиндром")) return 84;
  if (g === "Циклы" && (t.includes("вывести") || t.includes("сумма чисел") || t.includes("чётные"))) {
    return 8;
  }

  return 50;
};

export const getJsTaskProbability = (task: Task): number | null => {
  if (task.section !== "javascript") {
    return null;
  }

  const title = task.title || "";
  if (isSyntaxTask(title)) {
    return null;
  }

  const id = String(task.id);
  if (id in TASK_PROBABILITY_OVERRIDES) {
    return TASK_PROBABILITY_OVERRIDES[id];
  }

  return inferFallbackProbability(task.group || "", task.subgroup || "", title);
};

export const getJsTaskProbabilityInfo = (task: Task): TaskProbabilityInfo | null => {
  const probability = getJsTaskProbability(task);
  if (probability === null) {
    return null;
  }

  return {
    probability,
    variant: getProbabilityBadgeVariant(probability),
    label: getProbabilityBadgeLabel(probability),
    tooltip: getProbabilityBadgeTitle(probability),
  };
};
