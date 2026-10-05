import { describe, it, expect } from "vitest";
import { toggleLineComment, toggleBlockComment, getCommentSyntax } from "./comment-operations";

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

describe("JSX text comments", () => {
  it("comments and uncomments text without changing the rendered content", () => {
    const code = "const view = <div>hello</div>;";
    const cursor = code.indexOf("hello") + 2;
    const commented = toggleLineComment(code, cursor, cursor, "App.tsx");
    expect(commented.newCode).toBe("const view = <div>{/* hello */}</div>;");
    const uncommented = toggleLineComment(
      commented.newCode,
      commented.newCode.indexOf("hello") + 2,
      commented.newCode.indexOf("hello") + 2,
      "App.tsx"
    );
    expect(uncommented.newCode).toBe(code);
  });

  it("uses JSX comment syntax for a text selection", () => {
    const code = "const view = <div>hello</div>;";
    const start = code.indexOf("hello");
    expect(toggleBlockComment(code, start, start + 5, "App.jsx").newCode).toBe(
      "const view = <div>{/* hello */}</div>;"
    );
  });

  it("does not unwrap JSX-looking text inside a JavaScript string", () => {
    const code = 'const marker = "{/* hello */}";';
    const cursor = code.indexOf("hello");
    expect(toggleLineComment(code, cursor, cursor, "App.jsx").newCode).toBe(
      '// const marker = "{/* hello */}";'
    );
  });
});

describe("JSX element line comments", () => {
  const code = "const App = () => (\n  <div>\n    <h1>Title</h1>\n  </div>\n);";

  it("wraps an element line in a JSX comment instead of //", () => {
    const cursor = code.indexOf("h1>") + 1;
    const result = toggleLineComment(code, cursor, cursor, "App.jsx");
    expect(result.newCode).toBe(
      "const App = () => (\n  <div>\n    {/* <h1>Title</h1> */}\n  </div>\n);"
    );
    expect(result.newSelectionStart).toBe(cursor + 4);
  });

  it("restores the element line", () => {
    const commented = "const App = () => (\n  <div>\n    {/* <h1>Title</h1> */}\n  </div>\n);";
    const cursor = commented.indexOf("h1>") + 1;
    const result = toggleLineComment(commented, cursor, cursor, "App.tsx");
    expect(result.newCode).toBe(code);
    expect(result.newSelectionStart).toBe(cursor - 4);
  });

  it("comments several child lines and keeps indentation outside", () => {
    const source = "const A = () => (\n  <ul>\n    <li>a</li>\n    text\n  </ul>\n);";
    const start = source.indexOf("<li>");
    const end = source.indexOf("text") + 4;
    expect(toggleLineComment(source, start, end, "A.jsx").newCode).toBe(
      "const A = () => (\n  <ul>\n    {/* <li>a</li> */}\n    {/* text */}\n  </ul>\n);"
    );
  });

  it("keeps // for the JSX root line that starts in JavaScript", () => {
    const cursor = code.indexOf("<div>");
    expect(toggleLineComment(code, cursor, cursor, "App.jsx").newCode).toContain("  // <div>");
  });
});

describe("comment regressions", () => {
  it("uses JS comments inside <script> and CSS comments inside <style> of an HTML file", () => {
    const html = "<script>\nconst a = 1;\n</script>\n<style>\na { color: red }\n</style>";
    const jsAt = html.indexOf("const");
    expect(toggleLineComment(html, jsAt, jsAt, "index.html").newCode).toContain("// const a = 1;");
    const cssAt = html.indexOf("a {");
    expect(toggleLineComment(html, cssAt, cssAt, "index.html").newCode).toContain(
      "/* a { color: red } */"
    );
    const bodyAt = html.indexOf("</script>");
    expect(toggleLineComment(html, bodyAt, bodyAt, "index.html").newCode).toContain(
      "<!-- </script> -->"
    );
  });

  it("does not corrupt a JSX line that already holds comments", () => {
    const code = "const a = (\n  <p>\n    {/* a */} b {/* c */}\n  </p>\n);";
    const cursor = code.indexOf("{/* a");
    const result = toggleLineComment(code, cursor, cursor, "App.jsx");
    expect(result.changed).toBe(false);
    expect(result.newCode).toBe(code);
  });

  it("still uncomments a single JSX comment line", () => {
    const code = "const a = (\n  <p>\n    {/* text */}\n  </p>\n);";
    const cursor = code.indexOf("{/* text");
    expect(toggleLineComment(code, cursor, cursor, "App.jsx").newCode).toContain("    text\n");
  });
});

describe("SCSS and LESS comments", () => {
  it("toggles // line comments and recognises them again", () => {
    const code = ".a {\n  color: red;\n}";
    const at = code.indexOf("color");
    const commented = toggleLineComment(code, at, at, "a.scss").newCode;
    expect(commented).toBe(".a {\n  // color: red;\n}");
    const at2 = commented.indexOf("//");
    expect(toggleLineComment(commented, at2, at2, "a.less").newCode).toBe(code);
  });
});
