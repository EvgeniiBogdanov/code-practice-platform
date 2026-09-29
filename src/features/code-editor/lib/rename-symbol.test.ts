import { describe, expect, it } from "vitest";
import { applyRenameEdits } from "./rename-symbol";

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
});
