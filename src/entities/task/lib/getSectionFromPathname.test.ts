import { describe, expect, it } from "vitest";
import { getSectionFromPathname } from "./getSectionFromPathname";

describe("getSectionFromPathname", () => {
  it.each(["javascript", "typescript", "react", "algorithms"] as const)(
    "resolves %s routes",
    (section) => {
      expect(getSectionFromPathname(`/${section}`)).toBe(section);
      expect(getSectionFromPathname(`/${section}/`)).toBe(section);
      expect(getSectionFromPathname(`/${section}/task-1`)).toBe(section);
      expect(getSectionFromPathname(`/${section}/favorites`)).toBe(section);
      expect(getSectionFromPathname(`/open/${section}/task-1`)).toBe(section);
    }
  );

  it("returns null outside of sections", () => {
    expect(getSectionFromPathname("/")).toBeNull();
    expect(getSectionFromPathname("/home")).toBeNull();
    expect(getSectionFromPathname("/editor")).toBeNull();
    expect(getSectionFromPathname("/open")).toBeNull();
    expect(getSectionFromPathname("/open/unknown/a1")).toBeNull();
    expect(getSectionFromPathname("/reactive")).toBeNull();
  });
});
