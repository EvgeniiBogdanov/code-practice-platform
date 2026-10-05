import { afterEach, describe, expect, it, vi } from "vitest";
import { isApplePlatform } from "./is-apple-platform";

describe("isApplePlatform", () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15", true],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)", true],
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0", false],
    ["Mozilla/5.0 (X11; Linux x86_64) Firefox/121.0", false],
  ])("%s -> %s", (userAgent, expected) => {
    vi.stubGlobal("navigator", { userAgent });
    expect(isApplePlatform()).toBe(expected);
  });
});
