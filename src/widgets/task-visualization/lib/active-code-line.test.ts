import { describe, expect, it } from "vitest";
import {
  getAlgorithmDefinition,
  parseAlgorithmInput,
  VISUALIZED_ALGORITHM_IDS,
} from "@/entities/algorithm-trace";
import { getActiveCodeLine, getSolutionCode } from "./active-code-line";

const sources = import.meta.glob<string>(
  "/src/entities/task/curriculum/algorithms/solutions/{1_two_pointers,2_hash_map,3_sliding_window,4_prefix_sum,5_binary_search,6_stack,7_linked_list,8_dfs,9_bfs,10_backtracking}/*.js",
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
  algo4: "1_TwoSum.js",
  algo5: "2_ValidAnagram.js",
  algo6: "3_ContainsDuplicate.js",
  algo7: "4_GroupAnagrams.js",
  algo8: "1_LongestSubstring.js",
  algo9: "2_MaxAverageSubarray.js",
  algo10: "3_MinSizeSubarraySum.js",
  algo11: "1_RangeSumQueryImmutable.js",
  algo12: "2_SubarraySumEqualsK.js",
  algo13: "3_FindPivotIndex.js",
  algo14: "1_BinarySearch.js",
  algo15: "2_SearchInsertPosition.js",
  algo16: "3_FirstBadVersion.js",
  algo17: "4_SearchInRotatedArray.js",
  algo18: "1_ValidParentheses.js",
  algo19: "2_MinStack.js",
  algo20: "3_DailyTemperatures.js",
  algo21: "1_ReverseLinkedList.js",
  algo22: "2_MergeTwoSortedLists.js",
  algo23: "3_LinkedListCycle.js",
  algo24: "1_MaximumDepth.js",
  algo25: "2_InvertBinaryTree.js",
  algo26: "3_SameTree.js",
  algo27: "4_DiameterOfBinaryTree.js",
  algo28: "1_LevelOrderTraversal.js",
  algo29: "2_NumberOfIslands.js",
  algo30: "3_RottingOranges.js",
  algo31: "1_Subsets.js",
  algo32: "2_Permutations.js",
  algo33: "3_CombinationSum.js",
  algo34: "4_GenerateParentheses.js",
  algo40: "4_RemoveAdjacentDuplicates.js",
  algo41: "5_PreorderTraversal.js",
  algo42: "4_MinimumDepth.js",
  algo43: "5_FloodFill.js",
  algo44: "5_GenerateBinaryStrings.js",
  algo39: "4_RunningSum.js",
};

describe("trace to recommended solution mapping", () => {
  it.each(VISUALIZED_ALGORITHM_IDS)(
    "maps every step in every %s preset to a real source line",
    (id) => {
      const code = getSolutionCode(
        sources[Object.keys(sources).find((path) => path.endsWith(`/${files[id]}`))!]
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
