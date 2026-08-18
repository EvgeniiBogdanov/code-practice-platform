/**
 * testEngine.js
 * Автоматический запуск тестов для задач JavaScript в стиле LeetCode.
 * Извлекает сигнатуру функции, генерирует тест-кейсы из описания/решения и проверяет код кандидата.
 */

import { runNodeJsCode } from "./nodeRunner";

/**
 * Глубокое сравнение значений (для массивов, объектов, Set, Map и примитивов)
 */
export const deepEqual = (a, b) => {
  if (Object.is(a, b)) return true;
  if (a === null || b === null || a === undefined || b === undefined) return a === b;

  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, v] of a) {
      if (!b.has(k) || !deepEqual(b.get(k), v)) return false;
    }
    return true;
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, k) || !deepEqual(a[k], b[k])) {
        return false;
      }
    }
    return true;
  }

  return false;
};

/**
 * Извлекает имя главной функции из кода
 */
export const extractMainFunctionName = (codeText) => {
  if (!codeText) return null;

  // Ищем const isPalindrome = ... или function isPalindrome(...)
  const fnMatch =
    codeText.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/) ||
    codeText.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);

  return fnMatch ? fnMatch[1] : null;
};

/**
 * Извлекает тест-кейсы из описания, примеров или кода решения
 */
export const extractTestCasesFromTask = (task) => {
  const tests = [];
  const text = `${task.desc || ""} ${task.rawCandidate || ""} ${task.rawSolution || ""}`;

  // Ищем примеры вида: "Madam" → true, "Hello" → false
  // или console.log(isPalindrome("Madam")); // true
  const arrowMatches = text.matchAll(/["']([^"']+)["']\s*(?:→|->|=>|=)\s*(true|false|\d+|\[[^\]]+\]|"[^"]+"|\{[^}]+\})/gi);
  for (const m of arrowMatches) {
    let rawExpected = m[2].trim();
    let expectedVal;
    try {
      expectedVal = JSON.parse(rawExpected);
    } catch {
      expectedVal = rawExpected;
    }
    tests.push({
      input: [m[1]],
      inputStr: `"${m[1]}"`,
      expected: expectedVal,
      expectedStr: String(rawExpected),
    });
  }

  // Ищем вызовы вида console.log(fn(arg1, arg2)); // expected
  const callMatches = text.matchAll(/console\.log\(\s*([a-zA-Z0-9_$]+)\(([^)]*)\)\s*\);?\s*(?:\/\/\s*(.+))?/g);
  for (const m of callMatches) {
    const fnName = m[1];
    const rawArgs = m[2];
    const comment = m[3]?.trim();

    if (rawArgs !== undefined) {
      const sandboxHelpers = {
        createNode: (val = 0, left = null, right = null) => ({ val, left, right }),
        createTreeNode: (val = 0, left = null, right = null) => ({ val, left, right }),
        createListNode: (val = 0, next = null) => ({ val, next }),
        buildTree: (values) => {
          if (!values || values.length === 0) return null;
          const root = { val: values[0], left: null, right: null };
          const queue = [root];
          let i = 1;
          while (i < values.length) {
            const current = queue.shift();
            const leftVal = values[i++];
            if (leftVal !== null && leftVal !== undefined) {
              current.left = { val: leftVal, left: null, right: null };
              queue.push(current.left);
            }
            if (i < values.length) {
              const rightVal = values[i++];
              if (rightVal !== null && rightVal !== undefined) {
                current.right = { val: rightVal, left: null, right: null };
                queue.push(current.right);
              }
            }
          }
          return root;
        },
        treeToArray: (root) => {
          if (root === null) return [];
          const result = [];
          const queue = [root];
          while (queue.length > 0) {
            const node = queue.shift();
            if (node === null) {
              result.push(null);
            } else {
              result.push(node.val);
              queue.push(node.left);
              queue.push(node.right);
            }
          }
          while (result.length > 0 && result[result.length - 1] === null) {
            result.pop();
          }
          return result;
        },
        createLinkedList: (arr) => {
          if (!arr || arr.length === 0) return null;
          return arr.reduceRight((acc, val) => ({ val, next: acc }), null);
        },
        linkedListToArray: (head) => {
          const res = [];
          let curr = head;
          while (curr) {
            res.push(curr.val);
            curr = curr.next;
          }
          return res;
        },
        printLinkedList: (head) => {
          const res = [];
          let curr = head;
          while (curr) {
            res.push(curr.val);
            curr = curr.next;
          }
          return res;
        },
        createLinkedListWithCycle: (arr, pos) => {
          if (!arr || arr.length === 0) return null;
          const nodes = arr.map((val) => ({ val, next: null }));
          for (let i = 0; i < nodes.length - 1; i++) {
            nodes[i].next = nodes[i + 1];
          }
          if (pos >= 0 && pos < nodes.length) {
            nodes[nodes.length - 1].next = nodes[pos];
          }
          return nodes[0];
        },
        createListWithCycle: (arr, pos) => {
          if (!arr || arr.length === 0) return null;
          const nodes = arr.map((val) => ({ val, next: null }));
          for (let i = 0; i < nodes.length - 1; i++) {
            nodes[i].next = nodes[i + 1];
          }
          if (pos >= 0 && pos < nodes.length) {
            nodes[nodes.length - 1].next = nodes[pos];
          }
          return nodes[0];
        },
      };

      let parsedArgs = [];
      try {
        parsedArgs = new Function(
          "require",
          "helpers",
          `const { buildTree, createNode, createTreeNode, treeToArray, createListNode, createLinkedList, linkedListToArray, printLinkedList, createLinkedListWithCycle, createListWithCycle } = helpers;
           return [${rawArgs}];`
        )((mod) => sandboxHelpers, sandboxHelpers);
      } catch {
        parsedArgs = [rawArgs.trim()];
      }

      let expected = undefined;
      let expectedStr = comment || "";

      if (comment) {
        try {
          expected = new Function(
            "require",
            "helpers",
            `const { buildTree, createNode, createTreeNode, treeToArray, createListNode, createLinkedList, linkedListToArray, printLinkedList, createLinkedListWithCycle, createListWithCycle } = helpers;
             return ${comment};`
          )((mod) => sandboxHelpers, sandboxHelpers);
        } catch {
          expected = comment;
        }
      }

      tests.push({
        fnName,
        input: parsedArgs,
        inputStr: rawArgs.trim(),
        expected,
        expectedStr: expectedStr || (expected !== undefined ? JSON.stringify(expected) : "—"),
      });
    }
  }

  // Если для задачи "5. Палиндром" или похожей дефолтные кейсы:
  if (tests.length === 0) {
    if (task.title?.toLowerCase().includes("палиндром") || task.id === "js5") {
      return [
        { input: ["Madam"], inputStr: '"Madam"', expected: true, expectedStr: "true" },
        { input: ["Hello"], inputStr: '"Hello"', expected: false, expectedStr: "false" },
        { input: ["racecar"], inputStr: '"racecar"', expected: true, expectedStr: "true" },
        { input: ["A man a plan a canal Panama"], inputStr: '"A man a plan a canal Panama"', expected: false, expectedStr: "false" },
        { input: [""], inputStr: '""', expected: true, expectedStr: "true" },
      ];
    }

    if (task.title?.toLowerCase().includes("сумма") || task.title?.toLowerCase().includes("sum")) {
      return [
        { input: [[1, 2, 3, 4, 5]], inputStr: "[1, 2, 3, 4, 5]", expected: 15, expectedStr: "15" },
        { input: [[]], inputStr: "[]", expected: 0, expectedStr: "0" },
        { input: [[-1, 1, 0]], inputStr: "[-1, 1, 0]", expected: 0, expectedStr: "0" },
      ];
    }
  }

  // Убираем дубликаты
  const unique = [];
  const seen = new Set();
  for (const t of tests) {
    const key = `${t.inputStr} -> ${t.expectedStr}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(t);
    }
  }

  return unique.length > 0 ? unique : [
    { input: ["test"], inputStr: '"test"', expected: true, expectedStr: "true" }
  ];
};

/**
 * Запускает код кандидата против набора тест-кейсов
 */
export const runTestCases = async (codeText, testCases = []) => {
  if (!codeText || !codeText.trim()) {
    return {
      passedAll: false,
      results: [],
      error: "Код решения пуст",
      passedCount: 0,
      totalCount: testCases.length,
      durationMs: 0,
    };
  }

  const startTime = performance.now();
  const mainFnName = extractMainFunctionName(codeText);
  const results = [];

  for (let idx = 0; idx < testCases.length; idx++) {
    const tc = testCases[idx];
    const testFn = tc.fnName || mainFnName;

    let testExecutionCode = "";
    if (testFn) {
      testExecutionCode = `
        ${codeText}
        if (typeof ${testFn} !== 'function') {
          throw new Error("Функция '${testFn}' не объявлена в коде решения");
        }
        const __testArgs = ${JSON.stringify(tc.input)};
        const __res = ${testFn}(...__testArgs);
        return __res;
      `;
    } else {
      testExecutionCode = `
        ${codeText}
      `;
    }

    try {
      const runnerRes = await runNodeJsCode(testExecutionCode, { timeoutMs: 8000 });
      if (runnerRes.error) {
        results.push({
          id: idx + 1,
          inputStr: tc.inputStr,
          expected: tc.expected,
          expectedStr: tc.expectedStr,
          actual: undefined,
          actualStr: "Error",
          passed: false,
          error: runnerRes.error.message || String(runnerRes.error),
          durationMs: runnerRes.durationMs,
        });
      } else {
        const actual = runnerRes.result;
        const actualStr =
          actual === undefined
            ? "undefined"
            : actual === null
            ? "null"
            : typeof actual === "object"
            ? JSON.stringify(actual)
            : String(actual);

        const passed = tc.expected !== undefined ? deepEqual(actual, tc.expected) : true;

        results.push({
          id: idx + 1,
          inputStr: tc.inputStr,
          expected: tc.expected,
          expectedStr: tc.expectedStr,
          actual,
          actualStr,
          passed,
          error: null,
          durationMs: runnerRes.durationMs,
        });
      }
    } catch (err) {
      results.push({
        id: idx + 1,
        inputStr: tc.inputStr,
        expected: tc.expected,
        expectedStr: tc.expectedStr,
        actual: undefined,
        actualStr: "Error",
        passed: false,
        error: err.message || String(err),
        durationMs: 0,
      });
    }
  }

  const passedCount = results.filter((r) => r.passed).length;
  const passedAll = passedCount === testCases.length && testCases.length > 0;
  const durationMs = Math.round((performance.now() - startTime) * 10) / 10;

  return {
    passedAll,
    results,
    passedCount,
    totalCount: testCases.length,
    durationMs,
    error: null,
  };
};
