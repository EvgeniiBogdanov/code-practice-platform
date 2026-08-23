import { sandboxHelpers } from "./nodeSandboxHelpers";

export interface TestCase {
  fnName?: string;
  input: unknown[];
  inputStr: string;
  expected?: unknown;
  expectedStr: string;
}

export function extractTestCasesFromTask(task: {
  id?: string;
  title?: string;
  desc?: string;
  rawCandidate?: string;
  rawSolution?: string;
}): TestCase[] {
  const tests: TestCase[] = [];
  const text = `${task.desc || ""} ${task.rawCandidate || ""} ${task.rawSolution || ""}`;

  const arrowMatches = text.matchAll(
    /["']([^"']+)["']\s*(?:→|->|=>|=)\s*(true|false|\d+|\[[^\]]+\]|"[^"]+"|\{[^}]+\})/gi
  );
  for (const m of arrowMatches) {
    const rawExpected = m[2].trim();
    let expectedVal: unknown;
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

  const callMatches = text.matchAll(
    /console\.log\(\s*([a-zA-Z0-9_$]+)\(([^)]*)\)\s*\);?\s*(?:\/\/\s*(.+))?/g
  );
  for (const m of callMatches) {
    const fnName = m[1];
    const rawArgs = m[2];
    const comment = m[3]?.trim();

    if (rawArgs !== undefined) {
      let parsedArgs: any[] = [];
      try {
        parsedArgs = new Function(
          "require",
          "helpers",
          `const { buildTree, createNode, createTreeNode, treeToArray, createListNode, createLinkedList, linkedListToArray, printLinkedList, createLinkedListWithCycle, createListWithCycle } = helpers;
           return [${rawArgs}];`
        )((_mod: string) => sandboxHelpers, sandboxHelpers);
      } catch {
        parsedArgs = [rawArgs.trim()];
      }

      let expected: unknown = undefined;
      const expectedStr = comment || "";

      if (comment) {
        try {
          expected = new Function(
            "require",
            "helpers",
            `const { buildTree, createNode, createTreeNode, treeToArray, createListNode, createLinkedList, linkedListToArray, printLinkedList, createLinkedListWithCycle, createListWithCycle } = helpers;
             return ${comment};`
          )((_mod: string) => sandboxHelpers, sandboxHelpers);
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

  if (tests.length === 0) {
    if (task.title?.toLowerCase().includes("палиндром") || task.id === "js5") {
      return [
        { input: ["Madam"], inputStr: '"Madam"', expected: true, expectedStr: "true" },
        { input: ["Hello"], inputStr: '"Hello"', expected: false, expectedStr: "false" },
        { input: ["racecar"], inputStr: '"racecar"', expected: true, expectedStr: "true" },
        {
          input: ["A man a plan a canal Panama"],
          inputStr: '"A man a plan a canal Panama"',
          expected: false,
          expectedStr: "false",
        },
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

  const unique: TestCase[] = [];
  const seen = new Set<string>();
  for (const t of tests) {
    const key = `${t.inputStr} -> ${t.expectedStr}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(t);
    }
  }

  return unique.length > 0
    ? unique
    : [{ input: ["test"], inputStr: '"test"', expected: true, expectedStr: "true" }];
}
