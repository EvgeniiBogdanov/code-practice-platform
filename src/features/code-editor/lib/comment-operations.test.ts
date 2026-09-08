import { describe, it, expect } from "vitest";
import {
  toggleLineComment,
  toggleBlockComment,
  getCommentSyntax,
} from "./comment-operations";

describe("comment-operations", () => {
  describe("getCommentSyntax", () => {
    it("returns JS/TS syntax for js, ts, jsx, tsx", () => {
      expect(getCommentSyntax("main.js").line.prefix).toBe("// ");
      expect(getCommentSyntax("app.tsx").line.prefix).toBe("// ");
      expect(getCommentSyntax("utils.ts").block.start).toBe("/* ");
    });

    it("returns HTML syntax for html", () => {
      const syntax = getCommentSyntax("index.html");
      expect(syntax.line.prefix).toBe("<!-- ");
      expect(syntax.line.suffix).toBe(" -->");
      expect(syntax.block.start).toBe("<!-- ");
      expect(syntax.block.end).toBe(" -->");
    });

    it("returns CSS syntax for css", () => {
      const syntax = getCommentSyntax("styles.css");
      expect(syntax.line.prefix).toBe("/* ");
      expect(syntax.line.suffix).toBe(" */");
      expect(syntax.block.start).toBe("/* ");
      expect(syntax.block.end).toBe(" */");
    });

    it("returns SQL syntax for sql", () => {
      const syntax = getCommentSyntax("query.sql");
      expect(syntax.line.prefix).toBe("-- ");
      expect(syntax.block.start).toBe("/* ");
    });
  });

  describe("toggleLineComment", () => {
    it("comments a single unindented line and moves cursor", () => {
      const code = "const x = 1;";
      const result = toggleLineComment(code, 6, 6, "main.js");
      expect(result.newCode).toBe("// const x = 1;");
      expect(result.newSelectionStart).toBe(9);
      expect(result.newSelectionEnd).toBe(9);
    });

    it("uncomments a single commented line and restores cursor", () => {
      const code = "// const x = 1;";
      const result = toggleLineComment(code, 9, 9, "main.js");
      expect(result.newCode).toBe("const x = 1;");
      expect(result.newSelectionStart).toBe(6);
      expect(result.newSelectionEnd).toBe(6);
    });

    it("preserves indentation when commenting", () => {
      const code = "  const x = 1;";
      const result = toggleLineComment(code, 0, 14, "main.js");
      expect(result.newCode).toBe("  // const x = 1;");
    });

    it("preserves indentation when uncommenting", () => {
      const code = "  // const x = 1;";
      const result = toggleLineComment(code, 0, 17, "main.js");
      expect(result.newCode).toBe("  const x = 1;");
    });

    it("comments multiple selected lines", () => {
      const code = "const a = 1;\nconst b = 2;";
      const result = toggleLineComment(code, 0, code.length, "main.js");
      expect(result.newCode).toBe("// const a = 1;\n// const b = 2;");
      expect(result.newSelectionStart).toBe(0);
      expect(result.newSelectionEnd).toBe(result.newCode.length);
    });

    it("uncomments multiple selected lines when all are commented", () => {
      const code = "// const a = 1;\n// const b = 2;";
      const result = toggleLineComment(code, 0, code.length, "main.js");
      expect(result.newCode).toBe("const a = 1;\nconst b = 2;");
    });

    it("comments uncommented lines when selection is partially commented", () => {
      const code = "// const a = 1;\nconst b = 2;";
      const result = toggleLineComment(code, 0, code.length, "main.js");
      expect(result.newCode).toBe("// const a = 1;\n// const b = 2;");
    });

    it("handles HTML comments with prefix and suffix", () => {
      const code = "<div>Hello</div>";
      const result = toggleLineComment(code, 0, code.length, "index.html");
      expect(result.newCode).toBe("<!-- <div>Hello</div> -->");

      const unResult = toggleLineComment(result.newCode, 0, result.newCode.length, "index.html");
      expect(unResult.newCode).toBe("<div>Hello</div>");
    });

    it("handles CSS comments with prefix and suffix", () => {
      const code = "color: red;";
      const result = toggleLineComment(code, 0, code.length, "style.css");
      expect(result.newCode).toBe("/* color: red; */");

      const unResult = toggleLineComment(result.newCode, 0, result.newCode.length, "style.css");
      expect(unResult.newCode).toBe("color: red;");
    });
  });

  describe("toggleBlockComment", () => {
    it("wraps selected code with block comment", () => {
      const code = "const sum = a + b;";
      const result = toggleBlockComment(code, 12, 17, "main.js");
      expect(result.newCode).toBe("const sum = /* a + b */;");
      expect(result.newSelectionStart).toBe(12);
      expect(result.newSelectionEnd).toBe(23);
    });

    it("unwraps already wrapped block comment selection", () => {
      const code = "const sum = /* a + b */;";
      const result = toggleBlockComment(code, 12, 23, "main.js");
      expect(result.newCode).toBe("const sum = a + b;");
      expect(result.newSelectionStart).toBe(12);
      expect(result.newSelectionEnd).toBe(17);
    });

    it("inserts empty block comment when no selection", () => {
      const code = "const x = ;";
      const result = toggleBlockComment(code, 10, 10, "main.js");
      expect(result.newCode).toBe("const x = /*  */;");
      expect(result.newSelectionStart).toBe(13);
      expect(result.newSelectionEnd).toBe(13);
    });

    it("unwraps enclosing block comment when cursor is inside", () => {
      const code = "const x = /* 42 */;";
      const result = toggleBlockComment(code, 14, 14, "main.js");
      expect(result.newCode).toBe("const x = 42;");
    });

    it("wraps HTML with <!-- -->", () => {
      const code = "<span>text</span>";
      const result = toggleBlockComment(code, 0, code.length, "index.html");
      expect(result.newCode).toBe("<!-- <span>text</span> -->");

      const unResult = toggleBlockComment(result.newCode, 0, result.newCode.length, "index.html");
      expect(unResult.newCode).toBe("<span>text</span>");
    });
  });
});
