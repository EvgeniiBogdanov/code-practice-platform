import { describe, it, expect } from "vitest";
import {
  findWordAtPosition,
  findAllMatches,
  findNextMatch,
  applyMultiTextInsert,
  applyMultiBackspace,
  applyMultiDelete,
} from "./multi-cursor-operations";

describe("multi-cursor-operations", () => {
  describe("findWordAtPosition", () => {
    it("finds word under cursor", () => {
      const code = "const myVariable = 42;";
      const res = findWordAtPosition(code, 8); // on "myVariable"
      expect(res).toEqual({ start: 6, end: 16, word: "myVariable" });
    });

    it("finds word when cursor is at the end of the word", () => {
      const code = "const count = 0;";
      const res = findWordAtPosition(code, 11); // right after "count"
      expect(res).toEqual({ start: 6, end: 11, word: "count" });
    });

    it("returns null when cursor is surrounded by whitespace or punctuation", () => {
      const code = "const   count = 0;";
      expect(findWordAtPosition(code, 6)).toBeNull(); // middle of 3 spaces
      expect(findWordAtPosition(code, 14)).toBeNull(); // on "="
    });
  });

  describe("findAllMatches", () => {
    it("finds all occurrences in code", () => {
      const code = "foo + foo === foo;";
      const matches = findAllMatches(code, "foo");
      expect(matches).toEqual([
        { start: 0, end: 3 },
        { start: 6, end: 9 },
        { start: 14, end: 17 },
      ]);
    });

    it("returns empty array when target not found", () => {
      const code = "const a = 1;";
      expect(findAllMatches(code, "xyz")).toEqual([]);
    });
  });

  describe("findNextMatch", () => {
    const code = "item -> item -> item";

    it("finds first match if existingSelections is empty", () => {
      const match = findNextMatch(code, "item", []);
      expect(match).toEqual({ start: 0, end: 4 });
    });

    it("finds next match after existing selections", () => {
      const existing = [{ start: 0, end: 4 }];
      const next = findNextMatch(code, "item", existing);
      expect(next).toEqual({ start: 8, end: 12 });
    });

    it("finds third match after two existing selections", () => {
      const existing = [
        { start: 0, end: 4 },
        { start: 8, end: 12 },
      ];
      const next = findNextMatch(code, "item", existing);
      expect(next).toEqual({ start: 16, end: 20 });
    });

    it("wraps around to beginning if selection started mid-file", () => {
      const existing = [{ start: 8, end: 12 }];
      const next = findNextMatch(code, "item", existing);
      expect(next).toEqual({ start: 16, end: 20 });

      const allThree = [
        { start: 8, end: 12 },
        { start: 16, end: 20 },
      ];
      const wrapped = findNextMatch(code, "item", allThree);
      expect(wrapped).toEqual({ start: 0, end: 4 });
    });

    it("returns null when all occurrences are already selected", () => {
      const allSelected = [
        { start: 0, end: 4 },
        { start: 8, end: 12 },
        { start: 16, end: 20 },
      ];
      expect(findNextMatch(code, "item", allSelected)).toBeNull();
    });
  });

  describe("applyMultiTextInsert", () => {
    it("replaces all selected ranges simultaneously and places cursors at the end", () => {
      const code = "let val = 1; val += 2; return val;";
      const selections = [
        { start: 4, end: 7 }, // "val"
        { start: 13, end: 16 }, // "val"
        { start: 30, end: 33 }, // "val"
      ];

      const res = applyMultiTextInsert(code, selections, "count");
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("let count = 1; count += 2; return count;");
      expect(res.newSelections).toEqual([
        { start: 9, end: 9 }, // cursor after "count"
        { start: 20, end: 20 }, // cursor after "count"
        { start: 39, end: 39 }, // cursor after "count"
      ]);
    });

    it("inserts character at multiple collapsed cursors", () => {
      const code = "a\nb\nc";
      const selections = [
        { start: 1, end: 1 }, // after "a"
        { start: 3, end: 3 }, // after "b"
        { start: 5, end: 5 }, // after "c"
      ];

      const res = applyMultiTextInsert(code, selections, "X");
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("aX\nbX\ncX");
      expect(res.newSelections).toEqual([
        { start: 2, end: 2 },
        { start: 5, end: 5 },
        { start: 8, end: 8 },
      ]);
    });
  });

  describe("applyMultiBackspace", () => {
    it("deletes selected ranges", () => {
      const code = "foo bar foo";
      const selections = [
        { start: 0, end: 3 },
        { start: 8, end: 11 },
      ];

      const res = applyMultiBackspace(code, selections);
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe(" bar ");
      expect(res.newSelections).toEqual([
        { start: 0, end: 0 },
        { start: 5, end: 5 },
      ]);
    });

    it("deletes 1 character before collapsed cursors", () => {
      const code = "abc\ndef";
      const selections = [
        { start: 3, end: 3 }, // after "c"
        { start: 7, end: 7 }, // after "f"
      ];

      const res = applyMultiBackspace(code, selections);
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("ab\nde");
      expect(res.newSelections).toEqual([
        { start: 2, end: 2 },
        { start: 5, end: 5 },
      ]);
    });
  });

  describe("applyMultiDelete", () => {
    it("deletes 1 character after collapsed cursors", () => {
      const code = "abc\ndef";
      const selections = [
        { start: 0, end: 0 }, // before "a"
        { start: 4, end: 4 }, // before "d"
      ];

      const res = applyMultiDelete(code, selections);
      expect(res.changed).toBe(true);
      expect(res.newCode).toBe("bc\nef");
      expect(res.newSelections).toEqual([
        { start: 0, end: 0 },
        { start: 3, end: 3 },
      ]);
    });
  });
});
