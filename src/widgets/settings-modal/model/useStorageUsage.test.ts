import { describe, expect, it } from "vitest";
import { formatStorageSize } from "./useStorageUsage";

describe("formatStorageSize", () => {
  it("uses kilobytes below one megabyte", () => {
    expect(formatStorageSize(0.5)).toBe("512 КБ");
  });

  it("uses megabytes from one megabyte", () => {
    expect(formatStorageSize(3.5)).toBe("3.5 МБ");
  });
});
