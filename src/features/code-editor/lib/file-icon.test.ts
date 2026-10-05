import { describe, expect, it } from "vitest";
import { getFileIconKind } from "./file-icon";

describe("getFileIconKind", () => {
  it.each([
    ["a.js", "js"],
    ["a.mjs", "js"],
    ["a.jsx", "jsx"],
    ["a.ts", "ts"],
    ["a.cts", "ts"],
    ["a.tsx", "tsx"],
    ["a.css", "css"],
    ["a.scss", "css"],
    ["a.less", "css"],
    ["a.htm", "html"],
    ["a.json", "json"],
    ["a.md", "other"],
    ["a.sql", "other"],
    ["README", "other"],
  ])("%s -> %s", (name, kind) => {
    expect(getFileIconKind(name)).toBe(kind);
  });
});
