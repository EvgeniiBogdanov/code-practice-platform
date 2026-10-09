import { describe, expect, it } from "vitest";
import { deepEqual } from "@/shared/lib/code-runners/testEngine";
import { sandboxHelpers } from "@/shared/lib/code-runners/nodeSandboxHelpers";
import { loadTaskSection } from "./taskCatalog";

/** `console.log(expr); // expected` — the learner compares the console output with the comment. */
const EXAMPLE_LINE = /^console\.log\((.+)\);?[ \t]*\/\/[ \t]*(.+)$/gm;
const HELPER_NAMES = Object.keys(sandboxHelpers).join(", ");
const silentConsole = { log: () => {}, info: () => {}, warn: () => {}, error: () => {} };

/** Runs the whole solution once, in order, recording what each example line would print. */
const runExamples = (code: string, count: number): unknown[][] => {
  const printed: unknown[][] = Array.from({ length: count }, () => []);
  let index = 0;
  const instrumented = code.replace(EXAMPLE_LINE, (_line, expression: string) => {
    const call = `__print(${index}, [${expression}]);`;
    index += 1;
    return call;
  });
  new Function("console", "require", "__print", `"use strict";\n${instrumented}`)(
    silentConsole,
    () => sandboxHelpers,
    (at: number, values: unknown[]) => {
      printed[at] = values;
    }
  );
  return printed;
};

/** Several printed values (`console.log(k, arr)`) read as their JSON joined by spaces. */
const sameText = (values: unknown[], comment: string): boolean =>
  values
    .map((value) => JSON.stringify(value))
    .join(" ")
    .replace(/\s/g, "") === comment.replace(/'/g, '"').replace(/\s/g, "");

/** The comment is a JS literal (`[0, 1]`, `true`, `buildTree([...])`); prose comments are skipped. */
const parseExpected = (comment: string): { ok: true; value: unknown } | { ok: false } => {
  try {
    const value: unknown = new Function(
      "helpers",
      `const { ${HELPER_NAMES} } = helpers; return (${comment});`
    )(sandboxHelpers);
    return { ok: true, value };
  } catch {
    return { ok: false };
  }
};

describe("algorithms curriculum", async () => {
  const tasks = (await loadTaskSection("algorithms")).filter((task) => task.rawSolution);

  it.each(tasks.map((task) => [task.id, task] as const))(
    "%s: the reference solution prints what its examples promise",
    (_id, task) => {
      const solution = task.rawSolution ?? "";
      const comments = [...solution.matchAll(EXAMPLE_LINE)].map(([, , comment]) => comment.trim());
      const printed = runExamples(solution, comments.length);
      let checked = 0;

      comments.forEach((comment, at) => {
        const values = printed[at];
        const expected = parseExpected(comment);
        const matches =
          values.length > 1
            ? sameText(values, comment)
            : expected.ok && deepEqual(values[0], expected.value);
        if (values.length === 1 && !expected.ok) return;
        expect(
          matches,
          `example ${at + 1} printed ${JSON.stringify(values)}, comment says ${comment}`
        ).toBe(true);
        checked += 1;
      });

      expect(checked, "at least one checkable example").toBeGreaterThan(0);
    }
  );

  const exampleLines = (code: string): string[] =>
    [...code.matchAll(EXAMPLE_LINE)].map(([line]) => line.replace(/\s+/g, ""));

  it.each(tasks.map((task) => [task.id, task] as const))(
    "%s: the starter code shows the same examples as the reference solution",
    (_id, task) => {
      expect(exampleLines(task.rawCandidate ?? "")).toEqual(exampleLines(task.rawSolution ?? ""));
    }
  );
});
