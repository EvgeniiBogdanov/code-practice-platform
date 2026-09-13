import { describe, it, expect } from "vitest";
import { getCaretCoordinates, calculatePopupPosition, CaretCoordinates } from "./caret-coordinates";

describe("caret-coordinates", () => {
  const createMockTextarea = (value: string, overrides: Partial<HTMLTextAreaElement> = {}) => {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    Object.defineProperty(textarea, "clientWidth", { value: 800, writable: true });
    Object.defineProperty(textarea, "clientHeight", { value: 400, writable: true });
    Object.defineProperty(textarea, "scrollTop", { value: 0, writable: true });
    Object.defineProperty(textarea, "scrollLeft", { value: 0, writable: true });

    Object.assign(textarea, overrides);
    return textarea;
  };

  describe("getCaretCoordinates", () => {
    it("computes fallback coordinates for first line", () => {
      const textarea = createMockTextarea("const a = 1;");
      const coords = getCaretCoordinates(textarea, 5);

      expect(coords.top).toBeGreaterThanOrEqual(14);
      expect(coords.lineBottom).toBeGreaterThan(coords.top);
      expect(coords.left).toBeGreaterThan(16);
    });

    it("computes increased top coordinate for subsequent lines", () => {
      const textarea = createMockTextarea("line1\nline2\nline3");
      const line1Coords = getCaretCoordinates(textarea, 2);
      const line2Coords = getCaretCoordinates(textarea, 8); // in "line2"

      expect(line2Coords.top).toBeGreaterThan(line1Coords.top);
      expect(line2Coords.lineBottom).toBeGreaterThan(line1Coords.lineBottom);
    });
  });

  describe("calculatePopupPosition", () => {
    it("places popup BELOW the cursor line when there is plenty of space below", () => {
      const textarea = createMockTextarea("first line");
      const caret: CaretCoordinates = {
        top: 20,
        lineBottom: 41,
        lineHeight: 21,
        left: 50,
      };

      const result = calculatePopupPosition({
        caret,
        textarea,
        itemsCount: 5,
      });

      expect(result.placement).toBe("bottom");
      // Must be strictly greater than lineBottom
      expect(result.top).toBeGreaterThanOrEqual(caret.lineBottom + 6);
      expect(result.left).toBe(50);
      expect(result.maxHeight).toBe(220);
    });

    it("flips popup ABOVE the cursor line when there is not enough space below", () => {
      const textarea = createMockTextarea("bottom line");
      Object.defineProperty(textarea, "clientHeight", { value: 300 });

      // Cursor is near the bottom: top = 260, lineBottom = 281
      const caret: CaretCoordinates = {
        top: 260,
        lineBottom: 281,
        lineHeight: 21,
        left: 100,
      };

      const result = calculatePopupPosition({
        caret,
        textarea,
        itemsCount: 6, // estimated height ~200px, space below is only 300 - 281 - 6 = 13px
      });

      expect(result.placement).toBe("top");
      // In 'top' mode, top is at or before lineTop - 6 so it never covers the text
      expect(result.top).toBeLessThanOrEqual(caret.top - 6);
      expect(result.left).toBe(100);
      expect(result.maxHeight).toBeGreaterThanOrEqual(80);
    });

    it("clamps horizontal position to stay within textarea viewport bounds", () => {
      const textarea = createMockTextarea("wide code line");
      Object.defineProperty(textarea, "clientWidth", { value: 320 });

      // Cursor is near the right edge (col 100 -> left: 400px)
      const caret: CaretCoordinates = {
        top: 20,
        lineBottom: 41,
        lineHeight: 21,
        left: 300,
      };

      const result = calculatePopupPosition({
        caret,
        textarea,
        itemsCount: 3,
      });

      // Max allowed left = clientWidth (320) - DROPDOWN_WIDTH (280) - MARGIN (8) = 32
      expect(result.left).toBeLessThanOrEqual(32);
      expect(result.left).toBeGreaterThanOrEqual(8);
    });

    it("accounts for textarea scroll offsets correctly", () => {
      const textarea = createMockTextarea("scrolled code");
      Object.defineProperty(textarea, "scrollTop", { value: 100 });
      Object.defineProperty(textarea, "scrollLeft", { value: 20 });
      Object.defineProperty(textarea, "clientHeight", { value: 400 });

      const caret: CaretCoordinates = {
        top: 150,
        lineBottom: 171,
        lineHeight: 21,
        left: 80,
      };

      const result = calculatePopupPosition({
        caret,
        textarea,
        itemsCount: 4,
      });

      // viewportLineBottom = 171 - 100 = 71
      // top = 71 + 6 = 77
      expect(result.top).toBe(77);
      // viewportCaretLeft = 80 - 20 = 60
      expect(result.left).toBe(60);
      expect(result.placement).toBe("bottom");
    });
  });
});
