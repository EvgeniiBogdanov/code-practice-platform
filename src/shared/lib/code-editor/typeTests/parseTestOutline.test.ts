import { describe, expect, it } from "vitest";
import { parseTestOutline } from "./parseTestOutline";

describe("parseTestOutline", () => {
  it("lists tests with their groups and lines", () => {
    const source = [
      'test("top", () => {});',
      'describe("sum", () => {',
      '  test("adds", () => {',
      "    const x = 1;",
      "  });",
      '  test("rejects strings", () => {});',
      "});",
      'test("after the group", () => {});',
    ].join("\n");
    expect(parseTestOutline(source)).toEqual([
      { id: "/top", name: "top", describe: null, line: 1 },
      { id: "sum/adds", name: "adds", describe: "sum", line: 3 },
      { id: "sum/rejects strings", name: "rejects strings", describe: "sum", line: 6 },
      { id: "/after the group", name: "after the group", describe: null, line: 8 },
    ]);
  });

  it("reads names with escaped quotes", () => {
    expect(parseTestOutline('test("say \\"hi\\"", () => {});')[0].name).toBe('say "hi"');
  });
});
