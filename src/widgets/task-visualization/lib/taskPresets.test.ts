import { describe, expect, it } from "vitest";
import {
  VISUALIZED_ALGORITHM_IDS,
  getAlgorithmDefinition,
  parseAlgorithmInput,
} from "@/entities/algorithm-trace";
import { loadTaskSection } from "@/entities/task";
import { sandboxHelpers } from "@/shared/lib/code-runners/nodeSandboxHelpers";

const EXAMPLE_LINE = /^console\.log\((.+)\);?[ \t]*\/\/[ \t]*(.+)$/gm;
const silentConsole = { log: () => {}, info: () => {}, warn: () => {}, error: () => {} };

/** Everything the reference solution prints on its example lines, in order. */
const printedValues = (code: string): unknown[] => {
  const printed: unknown[] = [];
  const instrumented = code.replace(
    EXAMPLE_LINE,
    (_line, expression: string) => `__print(${expression});`
  );
  new Function("console", "require", "__print", `"use strict";\n${instrumented}`)(
    silentConsole,
    () => sandboxHelpers,
    (...values: unknown[]) => {
      printed.push(...values);
    }
  );
  return printed;
};

/** Results whose order is not part of the answer (subsets, groups) compare as sorted JSON. */
const sameAnswer = (left: unknown, right: unknown): boolean => {
  const sorted = (value: unknown): string =>
    Array.isArray(value)
      ? JSON.stringify(value.map((item) => JSON.stringify(item)).sort())
      : JSON.stringify(value);
  return JSON.stringify(left) === JSON.stringify(right) || sorted(left) === sorted(right);
};

describe("task visualization presets", async () => {
  const tasks = await loadTaskSection("algorithms");

  it.each(VISUALIZED_ALGORITHM_IDS.map((id) => [id] as const))(
    "%s: every «Пример N» preset reproduces an answer from the task examples",
    (id) => {
      const task = tasks.find((candidate) => candidate.id === id);
      const definition = getAlgorithmDefinition(id);
      expect(task?.rawSolution, "reference solution").toBeTruthy();
      expect(definition, "visualization definition").toBeDefined();
      if (!task?.rawSolution || !definition) return;

      const printed = printedValues(task.rawSolution);
      const presets = definition.examples.filter((example) => example.isTask);
      expect(presets.length, "at least one task preset").toBeGreaterThan(0);

      for (const preset of presets) {
        const parsed = parseAlgorithmInput(definition, preset.input, preset.parameter ?? "");
        expect(parsed.ok, `${preset.label} parses`).toBe(true);
        if (!parsed.ok) continue;
        const result = [...definition.build(parsed.input)]
          .reverse()
          .find((step) => step.result !== undefined)?.result;
        const matches =
          printed.some((value) => sameAnswer(value, result)) || sameAnswer(printed, result);
        expect(matches, `${preset.label} → ${JSON.stringify(result)}`).toBe(true);
      }
    }
  );
});
