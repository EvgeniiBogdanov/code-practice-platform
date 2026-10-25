import { describe, expect, it } from "vitest";
import { parseBreadcrumbRoute } from "./parseBreadcrumbRoute";

describe("parseBreadcrumbRoute", () => {
  it("parses section and task id", () => {
    expect(parseBreadcrumbRoute("/react")).toEqual({ section: "react", taskId: null });
    expect(parseBreadcrumbRoute("/algorithms/algo-1")).toEqual({
      section: "algorithms",
      taskId: "algo-1",
    });
  });

  it("parses full-screen editor routes", () => {
    expect(parseBreadcrumbRoute("/open/typescript/typescript-1")).toEqual({
      section: "typescript",
      taskId: "typescript-1",
    });
  });

  it("falls back to home outside of sections", () => {
    expect(parseBreadcrumbRoute("/editor")).toEqual({ section: "home", taskId: null });
  });
});
