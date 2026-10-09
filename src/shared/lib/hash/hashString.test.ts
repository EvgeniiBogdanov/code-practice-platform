import { describe, expect, it } from "vitest";
import { hashString } from "./hashString";

describe("hashString", () => {
  it("is stable and sensitive to every character", () => {
    expect(hashString("")).toBe("811c9dc5");
    expect(hashString("a")).toBe("e40c292c");
    expect(hashString("tests")).toBe(hashString("tests"));
    expect(hashString("tests")).not.toBe(hashString("tests "));
  });
});
