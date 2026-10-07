import { describe, expect, it } from "vitest";

const TOKEN_FILES = new Set(["tokens.css", "trace-tokens.css", "fonts.css"]);
// Landing keeps TypeScript's original blue next to its monochrome accent.
const HEX_ALLOWLIST = new Set(["LandingPage.module.css"]);
// Sizes that already exist as --fs-* tokens must not be written as raw px.
const TOKENISED_FONT_SIZES = new Set([9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 30, 40]);

const allCss = import.meta.glob<string>(["/src/**/*.css", "!/src/**/curriculum/**"], {
  query: "?raw",
  import: "default",
  eager: true,
});

const fileName = (file: string): string => file.slice(file.lastIndexOf("/") + 1);
const appCss = Object.entries(allCss).filter(([file]) => !TOKEN_FILES.has(fileName(file)));

describe("design tokens", () => {
  it("keeps raw hex colours inside the token files", () => {
    const offenders = appCss
      .filter(
        ([file, css]) => !HEX_ALLOWLIST.has(fileName(file)) && /#[0-9a-fA-F]{3,8}\b/.test(css)
      )
      .map(([file]) => file);

    expect(offenders).toEqual([]);
  });

  it("uses --fs-* tokens for sizes that exist in the type scale", () => {
    const offenders = appCss
      .filter(([, css]) =>
        [...css.matchAll(/font-size:\s*(\d+)px/g)].some((match) =>
          TOKENISED_FONT_SIZES.has(Number(match[1]))
        )
      )
      .map(([file]) => file);

    expect(offenders).toEqual([]);
  });

  it("defines the page canvas for both themes", () => {
    const tokens = allCss["/src/app/styles/tokens.css"];
    const [darkBlock, lightBlock] = tokens.split('[data-theme="light"] {');

    expect(darkBlock).toContain("--bg-canvas:");
    expect(lightBlock).toContain("--bg-canvas:");
  });
});
