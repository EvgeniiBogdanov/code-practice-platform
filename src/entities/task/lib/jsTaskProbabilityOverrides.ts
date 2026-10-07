/**
 * 2026 Frontend Interview Probability Map (Middle -> Senior Spectrum).
 * Keys must match real task ids from JS_TASKS — guarded by getJsTaskProbability.test.ts.
 */
export const TASK_PROBABILITY_OVERRIDES: Readonly<Record<string, number>> = {
  // === Область видимости и типы данных ===
  js249: 92, // var, let, const: block scope
  js255: 85, // Scope chain, lexical scope, shadowing
  js250: 90, // Hoisting of var and functions
  js251: 88, // Temporal Dead Zone
  js252: 90, // Function Declaration vs Expression vs Arrow
  js254: 60, // Default params, rest, arguments
  js253: 65, // IIFE and module pattern
  js256: 90, // typeof, primitives vs references
  js186: 96, // Type coercion edge cases
  js187: 88, // ToPrimitive: [] + {}, null comparisons
  js188: 92, // Object.is, || vs ??

  // === Циклы (разминка для Junior, редко на Middle/Senior) ===
  js2: 5, // Print 1 to N
  js3: 8, // Sum 1 to N
  js4: 5, // Print evens
  js5: 86, // Palindrome
  js6: 10, // Sum array (for)
  js7: 22, // Bubble sort
  js9: 10, // Sum array (for...of)
  js10: 5, // Print positives
  js11: 12, // Includes check
  js12: 12, // Filter by length
  js13: 20, // Count word occurrences
  js190: 20, // Sum salaries
  js191: 16, // Count props
  js192: 15, // Multiply numeric props
  js193: 25, // Own values
  js194: 55, // isEmpty object
  js195: 50, // Invert object
  js_while_2: 6, // Countdown
  js_while_3: 18, // Sum of digits
  js_while_4: 20, // Reverse number
  js_while_5: 22, // GCD (Euclid)
  js_while_6: 85, // Binary search
  js_while_7: 65, // Linked list traversal
  js_while_8: 94, // Merge two sorted arrays (two pointers)

  // === Объекты ===
  js198: 80, // in vs Object.hasOwn
  js199: 75, // Object.keys/values/entries/fromEntries
  js201: 88, // Shallow copy: spread vs Object.assign
  js204: 88, // pick
  js205: 88, // omit
  js217: 85, // Hidden mutation after shallow copy
  js246: 45, // Immutable diff/patch
  js207: 97, // Lodash get by path
  js208: 95, // Lodash set by path
  js247: 70, // safeGet / safeSet
  js222: 72, // Property descriptors
  js223: 45, // Object.keys vs Reflect.ownKeys
  js224: 70, // Symbol.toPrimitive
  js225: 80, // Proxy validator
  js228: 65, // Object.create(null) and prototype pollution

  // === Массивы ===
  js14: 10, // includes: string in array
  js15: 8, // includes with fromIndex
  js16: 8, // String includes
  js17: 30, // includes output question
  js18: 30, // includes output question
  js19: 10, // find first even
  js20: 10, // find long string
  js21: 10, // find negative
  js22: 25, // find user by name
  js23: 30, // find output question
  js264: 70, // some, every, findIndex
  js24: 10, // filter evens
  js25: 10, // filter long strings
  js26: 35, // filter falsy values
  js27: 20, // filter adults
  js28: 20, // filter active users
  js29: 10, // filter strings with letter
  js30: 10, // filter range
  js31: 20, // filter by profession
  js32: 25, // filter by position substring
  js33: 35, // filter by statuses list
  js34: 55, // filter output question
  js35: 10, // map squares
  js36: 10, // map string lengths
  js38: 25, // map names
  js39: 40, // map reshape objects
  js42: 10, // map even booleans
  js43: 80, // map output question
  js44: 30, // numeric sort comparator
  js45: 15, // sort strings
  js46: 15, // sort strings desc
  js47: 40, // sort users by age
  js48: 25, // sort by length
  js49: 60, // array permutation (Company X)
  js50: 75, // default lexicographic sort
  js52: 15, // reduce sum
  js53: 30, // reduce cart total
  js54: 20, // reduce sum and product
  js55: 60, // reduce count occurrences
  js56: 45, // reduce cart with quantity
  js57: 40, // reduce min/max
  js63: 90, // reduce average
  js64: 85, // reduce pairs to object
  js65: 86, // reduce sum by category
  js58: 75, // reduce flatten
  js59: 92, // reduce groupBy
  js66: 88, // reduce group names by category
  js60: 70, // reduce group with sorting
  js67: 88, // multi-level grouping (Company X)
  js68: 72, // reduce output question
  js265: 85, // slice vs splice, mutating methods
  js266: 55, // ES2023 immutable methods
  js267: 60, // flat / flatMap
  js268: 92, // unique values
  js235: 82, // chunk
  js269: 72, // Fisher-Yates shuffle
  js232: 95, // Array.prototype.map polyfill
  js233: 95, // Array.prototype.filter polyfill
  js234: 97, // Array.prototype.reduce polyfill
  js270: 93, // Array.prototype.flat polyfill

  // === Строки ===
  js257: 80, // Reverse string and words
  js258: 70, // Capitalize
  js263: 55, // Truncate
  js259: 65, // Count vowels
  js260: 88, // Anagram check
  js261: 82, // First unique character
  js262: 80, // String compression (RLE)
  js243: 60, // Unicode-safe reverse

  // === Коллекции ===
  js82: 60, // Unique words via Set
  js83: 90, // First repeated element
  js84: 82, // Unique objects by id
  js271: 85, // Set operations
  js85: 75, // Set basic methods output
  js86: 80, // Set object comparison output
  js88: 70, // Set iteration and deletion output
  js90: 30, // Map from pairs
  js91: 30, // Map get
  js92: 30, // Map has/delete
  js272: 85, // Object keys vs Map keys
  js93: 30, // Map for...of
  js94: 25, // Map forEach
  js95: 35, // Map keys/values/entries
  js96: 90, // Frequency counter
  js273: 95, // Two Sum
  js99: 95, // Anagrams (Company X)
  js196: 88, // Category tree (Company X)
  js274: 93, // LRU Cache
  js226: 75, // WeakMap private metadata
  js227: 65, // WeakSet cycle detection

  // === Функции и замыкания ===
  js126: 90, // Counter closure
  js128: 96, // var in loop with timers
  js129: 85, // Captured local variable
  js130: 85, // Fresh vs captured values
  js131: 90, // Closure over array in async loop
  js220: 90, // once decorator
  js276: 70, // Partial application
  js155: 90, // sum(a)(b)
  js275: 95, // Universal curry(fn)
  js156: 96, // Infinite currying
  js157: 85, // Currying with Symbol.toPrimitive
  js166: 90, // pipe / compose
  js101: 95, // memoize
  js100: 85, // memoize with TTL

  // === Рекурсия ===
  js133: 18, // Recursion on the way back
  js134: 40, // Factorial
  js135: 18, // Power
  js147: 75, // Fibonacci
  js136: 18, // Max in array
  js137: 97, // Deep flatten
  js139: 92, // Sum numbers in nested object
  js144: 85, // Collect primitives
  js138: 96, // deepClone
  js140: 90, // Binary tree sum
  js146: 88, // N-ary tree sum
  js145: 85, // Collect tree values
  js141: 90, // Tree depth
  js142: 85, // File search in tree
  js206: 95, // deepEqual
  js209: 92, // flattenObject
  js170: 75, // deepFreeze
  js248: 75, // camelCase / snake_case keys
  js211: 90, // deepMerge
  js210: 98, // deepClone with circular references

  // === this, прототипы и классы ===
  js277: 97, // Four this binding rules
  js148: 96, // this in regular vs arrow methods
  js150: 93, // Lost context after method extraction
  js151: 92, // Repeated bind
  js153: 90, // Arrow function in async method
  js278: 88, // call / apply polyfill
  js279: 96, // bind polyfill
  js154: 80, // in vs Object.hasOwn
  js149: 86, // Constructor prototype reassignment
  js152: 80, // Mutable prototype properties
  js282: 88, // Prototype inheritance without class
  js280: 88, // new operator polyfill
  js281: 85, // instanceof polyfill
  js283: 75, // Private fields, getters, static
  js284: 82, // extends and super output

  // === Итераторы и генераторы ===
  js285: 75, // Iterable range
  js286: 70, // Generators
  js287: 60, // Async generator pagination

  // === Асинхронность ===
  js75: 78, // Timeout cleanup
  js79: 76, // Interval with delay
  js80: 76, // Interval accumulation
  js77: 75, // Timer implementation
  js292: 85, // setInterval via recursive setTimeout
  js288: 85, // sleep(ms)
  js108: 82, // try/catch with async/await
  js109: 92, // Sequential async loop
  js218: 80, // try/catch/finally control flow
  js290: 70, // Custom error classes
  js289: 92, // Error propagation in promise chains
  js72: 84, // Nested setTimeout output
  js118: 99, // Microtask vs macrotask
  js174: 96, // Promise constructor and then
  js175: 96, // IIFE, Promise, microtasks
  js185: 98, // Promise chain ordering
  js293: 99, // async1/async2 classic order
  js179: 97, // Nested promises and async/await
  js180: 94, // Timers and microtasks
  js182: 98, // Complex macro/microtask mix
  js181: 70, // requestAnimationFrame order
  js110: 92, // Promise.all
  js111: 90, // Promise.allSettled
  js112: 91, // Promise.race timeout
  js113: 80, // Promise.any
  js114: 90, // Promisify
  js158: 98, // Promise.all polyfill
  js159: 96, // Promise.allSettled polyfill
  js160: 93, // Promise.race and Promise.any polyfills
  js291: 92, // MyPromise implementation
  js70: 99, // Debounce
  js165: 97, // Throttle
  js122: 90, // Async debounce with cancellation
  js115: 93, // Retry with delay
  js117: 85, // Async memoization
  js116: 98, // Concurrency pool
  js120: 85, // AbortController cancellation
  js121: 90, // Async task queue

  // === Паттерны и утилиты ===
  js294: 70, // Singleton
  js171: 98, // EventEmitter / PubSub
  js295: 98, // EventEmitter with chaining and once (variant of js171)
  js173: 85, // Observable / reactive signal
  js178: 90, // classnames
  js177: 88, // Query string parser
  js176: 80, // Template engine
  js244: 40, // Lexer / tokenizer
};
