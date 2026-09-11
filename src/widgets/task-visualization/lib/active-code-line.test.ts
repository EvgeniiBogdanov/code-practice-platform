import { describe, expect, it } from "vitest";
import {
  getAlgorithmDefinition,
  parseAlgorithmInput,
  VISUALIZED_ALGORITHM_IDS,
} from "@/entities/algorithm-trace";
import { getActiveCodeLine, getSolutionCode } from "./active-code-line";

const sources = import.meta.glob<string>(
  "/src/entities/task/curriculum/algorithms/solutions/1_two_pointers/*.js",
  { query: "?raw", import: "default", eager: true }
);
const files: Record<string, string> = {
  algo38: "7_RemoveElement.js",
  algo36: "5_RemoveDuplicates.js",
  algo35: "4_MoveZeroes.js",
  algo2: "2_ValidPalindrome.js",
  algo37: "6_SortArrayByParity.js",
  algo1: "1_TwoSumII.js",
  algo3: "3_ThreeSum.js",
};

describe("trace to recommended solution mapping", () => {
  it.each(VISUALIZED_ALGORITHM_IDS)(
    "maps every step in every %s preset to a real source line",
    (id) => {
      const code = getSolutionCode(
        sources[`/src/entities/task/curriculum/algorithms/solutions/1_two_pointers/${files[id]}`]
      );
      const definition = getAlgorithmDefinition(id)!;
      for (const example of definition.examples) {
        const parsed = parseAlgorithmInput(definition, example.input, example.parameter ?? "");
        if (!parsed.ok) throw new Error(parsed.error);
        for (const step of definition.build(parsed.input)) {
          expect(
            getActiveCodeLine(code, step),
            `${id}: ${step.line} #${step.occurrence ?? 0}`
          ).toBeGreaterThan(0);
        }
      }
      expect(code).not.toContain("console.log");
    }
  );
});
