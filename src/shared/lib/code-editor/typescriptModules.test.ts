import { describe, expect, it, vi } from "vitest";
import ts from "typescript";
import { createTypeScriptEditorService } from "./typescriptDiagnostics";

vi.setConfig({ testTimeout: 30_000 });

const libDirectory = ts.getDefaultLibFilePath({}).replace(/[/\\][^/\\]+$/, "");
const libraries = new Map(
  ts.sys
    .readDirectory(libDirectory, [".d.ts"])
    .filter((file) => /[/\\]lib[^/\\]*\.d\.ts$/.test(file))
    .map((file) => [`/${file.split(/[/\\]/).pop()}`, ts.sys.readFile(file) ?? ""])
);
const editor = createTypeScriptEditorService(libraries);
const errors = (code: string, filepath: string): string[] =>
  editor
    .diagnose({ code, filepath, files: [] })
    .filter((problem) => problem.severity !== "hint")
    .map((problem) => problem.message.slice(0, 7));

describe("module resolution in editor files", () => {
  it.each(["a.js", "a.jsx", "a.ts", "a.tsx"])(
    "reports a missing relative module in %s",
    (filepath) => {
      expect(errors("import { x } from './missing';\nx();", filepath)).toContain("TS2307:");
    }
  );

  it.each(["a.js", "a.ts"])("does not blame unknown npm packages in %s", (filepath) => {
    expect(errors("import axios from 'axios';\naxios.get('/');", filepath)).not.toContain(
      "TS2307:"
    );
  });

  it.each(["a.js", "a.ts", "a.tsx"])("accepts style, image and JSON imports in %s", (filepath) => {
    const code =
      "import styles from './a.module.css';\nimport './global.css';\nimport logo from './logo.svg';\nimport data from './data.json';\nconsole.log(styles.box, logo, data);";
    expect(errors(code, filepath)).toEqual([]);
  });
});

describe("argument count in JavaScript", () => {
  it("reports too many arguments but stays quiet about optional ones", () => {
    expect(errors("function f(a) { return a; }\nf(1, 2);", "a.js")).toContain("TS2554:");
    expect(errors("function f(a, b) { return a; }\nf(1);", "a.js")).toEqual([]);
  });
});

describe("rename", () => {
  it("keeps object shorthand valid and follows imports", () => {
    const code = "export const value = 1;\nexport const holder = { value };";
    const edits = editor.rename({ code, filepath: "a.ts", files: [] }, code.indexOf("value") + 1);
    const shorthand = edits.find((edit) => edit.start > code.indexOf("{"));
    expect(shorthand?.prefixText).toBe("value: ");

    // Imports follow the renamed export without an alias.
    const other = editor.rename(
      {
        code,
        filepath: "a.ts",
        files: [{ name: "b.ts", code: "import { value } from './a';\nconsole.log(value);" }],
      },
      code.indexOf("value") + 1
    );
    expect(other.filter((edit) => edit.filepath === "b.ts")).toHaveLength(2);
  });
});

describe("completion prefix", () => {
  it("completes a name that follows a colon without a space", () => {
    const code = "const abc = 1;\nconst o = {k:ab";
    const labels = editor
      .complete({ code, filepath: "a.ts", files: [] }, code.length)
      .map((item) => item.label);
    expect(labels).toContain("abc");
  });
});
