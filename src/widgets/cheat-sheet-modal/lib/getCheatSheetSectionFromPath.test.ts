import { describe, it, expect } from "vitest";
import { getCheatSheetSectionFromPath } from "./getCheatSheetSectionFromPath";

describe("getCheatSheetSectionFromPath", () => {
  it("should return 'react' for React routes", () => {
    expect(getCheatSheetSectionFromPath("/react")).toBe("react");
    expect(getCheatSheetSectionFromPath("/react/")).toBe("react");
    expect(getCheatSheetSectionFromPath("/react/1_FetchPersons")).toBe("react");
    expect(getCheatSheetSectionFromPath("/react/favorites")).toBe("react");
    expect(getCheatSheetSectionFromPath("/open/react/a1")).toBe("react");
  });

  it("should return 'javascript' for JavaScript routes", () => {
    expect(getCheatSheetSectionFromPath("/javascript")).toBe("javascript");
    expect(getCheatSheetSectionFromPath("/javascript/")).toBe("javascript");
    expect(getCheatSheetSectionFromPath("/javascript/js1")).toBe("javascript");
    expect(getCheatSheetSectionFromPath("/javascript/favorites")).toBe("javascript");
    expect(getCheatSheetSectionFromPath("/open/javascript/js10")).toBe("javascript");
  });

  it("should return 'algorithms' for Algorithms routes", () => {
    expect(getCheatSheetSectionFromPath("/algorithms")).toBe("algorithms");
    expect(getCheatSheetSectionFromPath("/algorithms/")).toBe("algorithms");
    expect(getCheatSheetSectionFromPath("/algorithms/algo-1")).toBe("algorithms");
    expect(getCheatSheetSectionFromPath("/algorithms/favorites")).toBe("algorithms");
    expect(getCheatSheetSectionFromPath("/open/algorithms/algo-5")).toBe("algorithms");
  });

  it("should return 'home' as fallback for general or unknown routes", () => {
    expect(getCheatSheetSectionFromPath("/")).toBe("home");
    expect(getCheatSheetSectionFromPath("/home")).toBe("home");
    expect(getCheatSheetSectionFromPath("/editor")).toBe("home");
    expect(getCheatSheetSectionFromPath("/unknown-page")).toBe("home");
  });
});
