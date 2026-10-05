import { describe, expect, it } from "vitest";
import { applyRenameEdits, getRenamedSelection } from "./renameSymbol";

describe("applyRenameEdits", () => {
  it("renames matching JSX tags without shifting later offsets", () => {
    const files = [{ name: "App.tsx", code: "const view = <Card>text</Card>;" }];
    const start = files[0].code.indexOf("Card");
    const end = files[0].code.lastIndexOf("Card");
    expect(
      applyRenameEdits(
        files,
        [
          { filepath: "App.tsx", start, end: start + 4 },
          { filepath: "App.tsx", start: end, end: end + 4 },
        ],
        "Panel"
      )[0].code
    ).toBe("const view = <Panel>text</Panel>;");
  });

  it("applies semantic rename locations across files", () => {
    const files = [
      { name: "Card.tsx", code: "export const Card = () => null;" },
      { name: "App.tsx", code: "import { Card } from './Card';" },
    ];
    const result = applyRenameEdits(
      files,
      [
        { filepath: "Card.tsx", start: 13, end: 17 },
        { filepath: "App.tsx", start: 9, end: 13 },
      ],
      "Panel"
    );
    expect(result[0].code).toContain("const Panel");
    expect(result[1].code).toContain("{ Panel }");
  });

  it("keeps object shorthand valid with prefix and suffix text", () => {
    const code = "const a = 1; const o = { a }; use(a);";
    const shorthand = code.indexOf("{ a") + 2;
    const edits = [
      { filepath: "x.ts", start: 6, end: 7 },
      { filepath: "x.ts", start: shorthand, end: shorthand + 1, prefixText: "a: " },
      { filepath: "x.ts", start: code.lastIndexOf("a"), end: code.lastIndexOf("a") + 1 },
    ];
    expect(applyRenameEdits([{ name: "x.ts", code }], edits, "count")[0].code).toBe(
      "const count = 1; const o = { a: count }; use(count);"
    );
  });

  it("selects the renamed symbol after earlier occurrences grew", () => {
    const code = "const a = 1; use(a);";
    const edits = [
      { filepath: "x.ts", start: 6, end: 7 },
      { filepath: "x.ts", start: 17, end: 18 },
    ];
    const renamed = applyRenameEdits([{ name: "x.ts", code }], edits, "count")[0].code;
    const { start, end } = getRenamedSelection(edits, edits[1], "count");
    expect(renamed.slice(start, end)).toBe("count");
    expect(start).toBe(renamed.lastIndexOf("count"));
  });
});
