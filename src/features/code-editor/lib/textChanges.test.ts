import { describe, expect, it } from "vitest";
import { applyTextChanges } from "./textChanges";

describe("applyTextChanges", () => {
  it("applies an import insertion and keeps the caret on the same token", () => {
    const code = "const [a] = useState(0);";
    const caret = code.indexOf("useState") + 3;
    const result = applyTextChanges(code, [
      { start: 0, end: 0, newText: 'import { useState } from "react";\n\n' },
    ]);
    expect(result.code).toBe('import { useState } from "react";\n\nconst [a] = useState(0);');
    expect(result.code.slice(result.mapOffset(caret) - 3, result.mapOffset(caret))).toBe("use");
  });

  it("applies several replacements against the original offsets", () => {
    const result = applyTextChanges("aa bb cc", [
      { start: 6, end: 8, newText: "C" },
      { start: 0, end: 2, newText: "AAAA" },
    ]);
    expect(result.code).toBe("AAAA bb C");
    expect(result.mapOffset(3)).toBe(5);
    expect(result.mapOffset(1)).toBe(4);
  });
});
