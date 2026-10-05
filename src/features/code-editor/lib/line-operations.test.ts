import { describe, it, expect } from "vitest";
import {
  getLineOffsets,
  getLineIndexFromOffset,
  getSelectedLineRange,
  changeLineIndentation,
  moveLines,
  duplicateLines,
  deleteLines,
  insertLineAbove,
  getSmartHomeOffset,
} from "./line-operations";

describe("line-operations", () => {
  describe("getLineOffsets", () => {
    it("returns correct line start offsets", () => {
      const code = "abc\ndef\nghi";
      expect(getLineOffsets(code)).toEqual([0, 4, 8]);
    });

    it("handles single line without newline", () => {
      expect(getLineOffsets("hello")).toEqual([0]);
    });

    it("handles trailing newline", () => {
      expect(getLineOffsets("a\nb\n")).toEqual([0, 2, 4]);
    });
  });

  describe("getLineIndexFromOffset", () => {
    const offsets = [0, 4, 8];

    it("finds correct line index for offsets", () => {
      expect(getLineIndexFromOffset(offsets, 0)).toBe(0);
      expect(getLineIndexFromOffset(offsets, 3)).toBe(0);
      expect(getLineIndexFromOffset(offsets, 4)).toBe(1);
      expect(getLineIndexFromOffset(offsets, 7)).toBe(1);
      expect(getLineIndexFromOffset(offsets, 8)).toBe(2);
      expect(getLineIndexFromOffset(offsets, 10)).toBe(2);
    });
  });

  describe("getSelectedLineRange", () => {
    const code = "line0\nline1\nline2";
    const offsets = getLineOffsets(code); // [0, 6, 12]

    it("returns single line range when cursor is collapsed", () => {
      expect(getSelectedLineRange(code, 2, 2, offsets)).toEqual({ startLine: 0, endLine: 0 });
      expect(getSelectedLineRange(code, 8, 8, offsets)).toEqual({ startLine: 1, endLine: 1 });
    });

    it("returns multi-line range for multi-line selection", () => {
      expect(getSelectedLineRange(code, 2, 9, offsets)).toEqual({ startLine: 0, endLine: 1 });
    });

    it("excludes subsequent line if selection ends exactly at offset 0 of next line", () => {
      // 0 to 6 is "line0\n". Next line starts at 6.
      expect(getSelectedLineRange(code, 0, 6, offsets)).toEqual({ startLine: 0, endLine: 0 });
      // 0 to 12 is "line0\nline1\n". Line 2 starts at 12.
      expect(getSelectedLineRange(code, 0, 12, offsets)).toEqual({ startLine: 0, endLine: 1 });
    });
  });

  describe("changeLineIndentation", () => {
    it("indents selected lines while excluding a line at the selection end", () => {
      const result = changeLineIndentation("one\ntwo\nthree", 0, 8, 2, "indent");
      expect(result).toEqual({
        newCode: "  one\n  two\nthree",
        newSelectionStart: 0,
        newSelectionEnd: 12,
        changed: true,
      });
    });

    it("outdents selected lines and keeps the selection aligned", () => {
      const result = changeLineIndentation("  one\n\ttwo\nthree", 0, 10, 2, "outdent");
      expect(result).toEqual({
        newCode: "one\ntwo\nthree",
        newSelectionStart: 0,
        newSelectionEnd: 7,
        changed: true,
      });
    });

    it("outdents the current line without a selection", () => {
      expect(changeLineIndentation("  value", 4, 4, 2, "outdent")).toEqual({
        newCode: "value",
        newSelectionStart: 2,
        newSelectionEnd: 2,
        changed: true,
      });
    });
  });

  describe("moveLines", () => {
    const code = "line0\nline1\nline2";

    it("moves single line up", () => {
      // Cursor at line 1 ("line1", offset 8, col 2)
      const res = moveLines(code, 8, 8, "up");
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("line1\nline0\nline2");
      // "line0\n" has 6 chars. 8 - 6 = 2 (col 2 of line 0)
      expect(res.newSelectionStart).toBe(2);
      expect(res.newSelectionEnd).toBe(2);
    });

    it("moves single line down", () => {
      // Cursor at line 1 ("line1", offset 8, col 2)
      const res = moveLines(code, 8, 8, "down");
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("line0\nline2\nline1");
      // "line2\n" has 6 chars. 8 + 6 = 14 (col 2 of line 2)
      expect(res.newSelectionStart).toBe(14);
      expect(res.newSelectionEnd).toBe(14);
    });

    it("does nothing when moving top line up", () => {
      const res = moveLines(code, 2, 2, "up");
      expect(res.changed).toBe(false);
      expect(res.newCode).toBe(code);
      expect(res.newSelectionStart).toBe(2);
      expect(res.newSelectionEnd).toBe(2);
    });

    it("does nothing when moving bottom line down", () => {
      const res = moveLines(code, 14, 14, "down");
      expect(res.changed).toBe(false);
      expect(res.newCode).toBe(code);
      expect(res.newSelectionStart).toBe(14);
      expect(res.newSelectionEnd).toBe(14);
    });

    it("moves multi-line selection up", () => {
      const multi = "line0\nline1\nline2\nline3";
      // Select line 1 to line 2 (offset 8 to 15)
      const res = moveLines(multi, 8, 15, "up");
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("line1\nline2\nline0\nline3");
      // Shifted up by length of line0 + '\n' (6 chars)
      expect(res.newSelectionStart).toBe(2);
      expect(res.newSelectionEnd).toBe(9);
    });

    it("moves multi-line selection down", () => {
      const multi = "line0\nline1\nline2\nline3";
      // Select line 1 to line 2 (offset 8 to 15)
      const res = moveLines(multi, 8, 15, "down");
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("line0\nline3\nline1\nline2");
      // Shifted down by length of line3 + '\n' (6 chars)
      expect(res.newSelectionStart).toBe(14);
      expect(res.newSelectionEnd).toBe(21);
    });

    it("handles lines of different lengths correctly", () => {
      const diff = "short\na very long line here\nmed";
      // Cursor on "med", col 2: "short\n" is 6, "a very long line here\n" is 22 -> "med" starts at 28.
      const res = moveLines(diff, 30, 30, "up");
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("short\nmed\na very long line here");
      // "a very long line here\n" has 22 chars. 30 - 22 = 8 (col 2 of "med" at offset 6)
      expect(res.newSelectionStart).toBe(8);
      expect(res.newSelectionEnd).toBe(8);
    });
  });

  describe("duplicateLines", () => {
    const code = "line0\nline1\nline2";

    it("duplicates single line down", () => {
      const res = duplicateLines(code, 8, 8, "down");
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("line0\nline1\nline1\nline2");
      // Selection moved to duplicated copy (shifted by "line1\n".length = 6)
      expect(res.newSelectionStart).toBe(14);
      expect(res.newSelectionEnd).toBe(14);
    });

    it("duplicates single line up", () => {
      const res = duplicateLines(code, 8, 8, "up");
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("line0\nline1\nline1\nline2");
      expect(res.newSelectionStart).toBe(8);
      expect(res.newSelectionEnd).toBe(8);
    });

    it("duplicates multi-line selection down", () => {
      const res = duplicateLines(code, 2, 8, "down");
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("line0\nline1\nline0\nline1\nline2");
      // Block length of "line0\nline1" + 1 = 12
      expect(res.newSelectionStart).toBe(14);
      expect(res.newSelectionEnd).toBe(20);
    });
  });
});

describe("deleteLines", () => {
  it("removes the caret's line and keeps the column on the line that moves up", () => {
    const code = "aaa\nbbbb\ncc";
    const result = deleteLines(code, 6, 6);
    expect(result.newCode).toBe("aaa\ncc");
    // Column 2 of "bbbb" is clamped to the end of "cc".
    expect(result.newSelectionStart).toBe(6);
  });

  it("removes every selected line and ignores a selection that ends at a line start", () => {
    const code = "a\nb\nc\nd";
    expect(deleteLines(code, 2, 5).newCode).toBe("a\nd");
    expect(deleteLines(code, 0, 4).newCode).toBe("c\nd");
  });

  it("deletes the last line and puts the caret on the new last one", () => {
    const result = deleteLines("one\ntwo", 6, 6);
    expect(result.newCode).toBe("one");
    expect(result.newSelectionStart).toBe(2);
  });

  it("empties a single-line document", () => {
    expect(deleteLines("only", 2, 2)).toMatchObject({ newCode: "", newSelectionStart: 0 });
    expect(deleteLines("", 0, 0).changed).toBe(false);
  });
});

describe("insertLineAbove", () => {
  it("opens an indented line above and puts the caret in it", () => {
    const result = insertLineAbove("if (a) {\n  b();\n}", 12, 12);
    expect(result.newCode).toBe("if (a) {\n  \n  b();\n}");
    expect(result.newSelectionStart).toBe(11);
  });

  it("works on the first line", () => {
    expect(insertLineAbove("x", 1, 1)).toMatchObject({ newCode: "\nx", newSelectionStart: 0 });
  });
});

describe("getSmartHomeOffset", () => {
  const code = "  const a = 1;\n\n    \nlast";

  it("goes to the first character, then to column 0, then back", () => {
    expect(getSmartHomeOffset(code, 10)).toBe(2);
    expect(getSmartHomeOffset(code, 2)).toBe(0);
    expect(getSmartHomeOffset(code, 0)).toBe(2);
    expect(getSmartHomeOffset(code, 1)).toBe(2);
  });

  it("goes to column 0 on empty and whitespace-only lines", () => {
    expect(getSmartHomeOffset(code, 15)).toBe(15);
    expect(getSmartHomeOffset(code, 20)).toBe(16);
  });

  it("works on an unindented line and the last line", () => {
    expect(getSmartHomeOffset(code, 24)).toBe(21);
    expect(getSmartHomeOffset(code, 21)).toBe(21);
  });
});
