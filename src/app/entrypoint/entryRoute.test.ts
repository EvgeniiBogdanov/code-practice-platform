import { describe, expect, it } from "vitest";
import {
  resolveEntryTarget,
  sanitizeRedirectPath,
  toAppPath,
  toBrowserPath,
  type BrowserLocation,
} from "./entryRoute";

const BASE = "/code-practice-platform/";

const at = (pathname: string, search = "", hash = ""): BrowserLocation => ({
  pathname,
  search,
  hash,
});

describe("entry route", () => {
  it("converts between browser and app paths for both deploy bases", () => {
    expect(toAppPath("/code-practice-platform/", BASE)).toBe("/");
    expect(toAppPath("/code-practice-platform", BASE)).toBe("/");
    expect(toAppPath("/code-practice-platform/react/w1", BASE)).toBe("/react/w1");
    expect(toAppPath("/home", "/")).toBe("/home");
    expect(toBrowserPath("/home", BASE)).toBe("/code-practice-platform/home");
    expect(toBrowserPath("/", "/")).toBe("/");
  });

  it("boots the landing for guests on the root path", () => {
    expect(resolveEntryTarget(at("/code-practice-platform/"), BASE, false)).toEqual({
      kind: "landing",
      url: "/code-practice-platform/",
      redirectTo: null,
    });
  });

  it("sends signed-in users from the landing straight to the workspace home", () => {
    expect(resolveEntryTarget(at("/code-practice-platform/"), BASE, true)).toEqual({
      kind: "workspace",
      url: "/code-practice-platform/home",
    });
  });

  it("keeps deep links for signed-in users untouched", () => {
    const location = at("/code-practice-platform/javascript/js70", "?tab=solution");

    expect(resolveEntryTarget(location, BASE, true)).toEqual({
      kind: "workspace",
      url: "/code-practice-platform/javascript/js70?tab=solution",
    });
  });

  it("parks guest deep links on the landing with a return path", () => {
    const location = at("/code-practice-platform/javascript/js70", "?tab=solution");

    expect(resolveEntryTarget(location, BASE, false)).toEqual({
      kind: "landing",
      url: "/code-practice-platform/?redirect=%2Fjavascript%2Fjs70%3Ftab%3Dsolution",
      redirectTo: "/javascript/js70?tab=solution",
    });
  });

  it("honours a safe return path once the account exists", () => {
    const location = at("/code-practice-platform/", "?redirect=%2Freact%2Fw1");

    expect(resolveEntryTarget(location, BASE, true)).toEqual({
      kind: "workspace",
      url: "/code-practice-platform/react/w1",
    });
    expect(resolveEntryTarget(location, BASE, false)).toMatchObject({ redirectTo: "/react/w1" });
  });

  it("rejects open redirects and landing loops", () => {
    expect(sanitizeRedirectPath("https://evil.example")).toBeNull();
    expect(sanitizeRedirectPath("//evil.example/home")).toBeNull();
    expect(sanitizeRedirectPath("/\\evil.example")).toBeNull();
    expect(sanitizeRedirectPath("/")).toBeNull();
    expect(sanitizeRedirectPath(null)).toBeNull();
    expect(sanitizeRedirectPath("/algorithms/algo4#step")).toBe("/algorithms/algo4#step");
  });
});
