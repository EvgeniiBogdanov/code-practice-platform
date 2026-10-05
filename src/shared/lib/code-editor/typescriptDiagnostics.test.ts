import { describe, expect, it, vi } from "vitest";
import ts from "typescript";
import {
  createTypeScriptDiagnostics,
  createTypeScriptEditorService,
} from "./typescriptDiagnostics";

// Real TypeScript programs are built here; under CI coverage the cold ones exceed the 5s default.
vi.setConfig({ testTimeout: 30_000 });

const libDirectory = ts.getDefaultLibFilePath({}).replace(/[/\\][^/\\]+$/, "");
const libraries = new Map(
  ts.sys
    .readDirectory(libDirectory, [".d.ts"])
    .filter((file) => /[/\\]lib[^/\\]*\.d\.ts$/.test(file))
    .map((file) => [`/${file.split(/[/\\]/).pop()}`, ts.sys.readFile(file) ?? ""])
);
for (const file of ts.sys.readDirectory("node_modules/@types/react", [".d.ts"])) {
  libraries.set(`/${file}`, ts.sys.readFile(file) ?? "");
}
libraries.set(
  "/node_modules/csstype/index.d.ts",
  ts.sys.readFile("node_modules/csstype/index.d.ts") ?? ""
);
const diagnose = createTypeScriptDiagnostics(libraries);
const check = (code: string): ReturnType<typeof diagnose> =>
  diagnose({ code, filepath: "exercise.ts", files: [] });

describe("TypeScript editor diagnostics", () => {
  it("checks inferred types and readonly properties", () => {
    const problems = check(
      'let name = "Alice";\nname = 42;\nconst user: {readonly id: number} = {id: 1};\nuser.id = 2;'
    );
    expect(problems.map(({ line }) => line)).toEqual([2, 4]);
    expect(problems.every(({ severity }) => severity === "error")).toBe(true);
  });

  it("checks generic keys and keeps the inferred return type", () => {
    const source =
      "function get<T extends object, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }\n";
    expect(check(source + 'const name: string = get({name: "Alice"}, "name");')).toEqual([]);
    expect(check(source + 'get({name: "Alice"}, "missing");')[0].message).toContain("TS2345");
    expect(
      check(source + 'const value: number = get({name: "Alice"}, "name");')[0].message
    ).toContain("TS2322");
  });

  it("supports standard utilities, template types and function overloads", () => {
    expect(
      check(
        'type User = {id: number; name: string}; type Patch = Partial<User>;\ntype Handler = `on${Capitalize<"click" | "focus">}`;\nfunction make(tag: "img"): {src: string};\nfunction make(tag: string): object;\nfunction make(tag: string): object {return {src: tag};}\nconst image = make("img"); image.src = "photo.jpg";'
      )
    ).toEqual([]);
  });

  it("rejects interchangeable branded IDs and accepts standalone browser names", () => {
    expect(
      check(
        'type Brand<T, K> = T & {readonly brand: K};\ndeclare const order: Brand<string, "Order">;\nconst user: Brand<string, "User"> = order;'
      )[0].message
    ).toContain("TS2322");
    expect(
      check(
        'const status = "pending";\ninterface Comment {id: number; email: string}\nconst item: Comment = {id: 1, email: "a@b.com"};'
      )
    ).toEqual([]);
  });

  it("reports incomplete syntax and refreshes diagnostics after an edit", () => {
    expect(
      check(
        'function format(id: number): string { if (/* condition */) return ""; return id.toFixed(2); }'
      ).length
    ).toBeGreaterThan(0);
    expect(check('const count: number = "wrong";').length).toBeGreaterThan(0);
    expect(check("const count: number = 10;")).toEqual([]);
  });
});

describe("TSX compiler mode", () => {
  it("accepts intrinsic elements, typed components and React hooks", () => {
    expect(
      diagnose({
        code: 'import {useState} from "react"; const Card = ({name}: {name: string}) => <div>{name}</div>; const App = () => {const [name] = useState("Ada"); return <Card name={name} />;};',
        filepath: "App.tsx",
        files: [],
      })
    ).toEqual([]);
  });
  it("checks component props and generic arrow functions", () => {
    const problems = diagnose({
      code: "const id = <T,>(value: T): T => value; const Card = ({name}: {name: string}) => <div>{name}</div>; const app = <Card name={id(42)} />;",
      filepath: "App.tsx",
      files: [],
    });
    expect(problems).toHaveLength(1);
    expect(problems[0].message).toContain("TS2322");
  });
});

describe("JSX and TSX language features", () => {
  const editor = createTypeScriptEditorService(libraries);
  const errors = (input: Parameters<typeof editor.diagnose>[0]) =>
    editor.diagnose(input).filter((problem) => problem.severity !== "hint");

  it("reports mismatched JSX tags in JavaScript files", () => {
    const problems = editor.diagnose({
      code: "const view = <div></span>;",
      filepath: "App.jsx",
      files: [],
    });
    expect(problems.some((problem) => problem.severity === "error")).toBe(true);
  });

  it("completes typed custom component props", () => {
    const code =
      "const Card = ({ name }: { name: string }) => <div>{name}</div>;\nconst view = <Card na";
    const completions = editor.complete({ code, filepath: "App.tsx", files: [] }, code.length);
    expect(completions.map((item) => item.label)).toContain("name");
  });

  it("provides symbol hover and function signature", () => {
    const code = "function greet(name: string): string { return name; }\ngreet(";
    const input = { code, filepath: "App.tsx", files: [] };
    expect(editor.hover(input, code.indexOf("greet("))).not.toBeNull();
    expect(editor.signature(input, code.length)?.signature).toContain("name: string");
  });

  it("finds both sides of a JSX tag rename", () => {
    const code = "const view = <div>text</div>;";
    const locations = editor.rename(
      { code, filepath: "App.tsx", files: [] },
      code.indexOf("div") + 1
    );
    expect(locations.filter((location) => location.filepath === "App.tsx")).toHaveLength(2);
  });

  it("finds symbol references in another editor file", () => {
    const code = "export const Card = () => null;";
    const locations = editor.rename(
      {
        code,
        filepath: "Card.tsx",
        files: [{ name: "App.tsx", code: "import { Card } from './Card'; const view = <Card />;" }],
      },
      code.indexOf("Card") + 1
    );
    expect(new Set(locations.map((location) => location.filepath))).toEqual(
      new Set(["Card.tsx", "App.tsx"])
    );
  });

  it("renames component references from a JSX tag", () => {
    const code = "const Card = () => null; const view = <Card />;";
    const locations = editor.rename(
      { code, filepath: "App.tsx", files: [] },
      code.lastIndexOf("Card") + 1
    );
    expect(locations).toHaveLength(2);
    expect(locations.map(({ start, end }) => code.slice(start, end))).toEqual(["Card", "Card"]);
  });

  it("resolves declarations from an installed component package", () => {
    const packageLibraries = new Map(libraries);
    for (const file of ts.sys.readDirectory("node_modules/lucide-react", [".d.ts"])) {
      packageLibraries.set(`/${file}`, ts.sys.readFile(file) ?? "");
    }
    packageLibraries.set(
      "/node_modules/lucide-react/package.json",
      ts.sys.readFile("node_modules/lucide-react/package.json") ?? ""
    );
    const packageEditor = createTypeScriptEditorService(packageLibraries);
    expect(
      packageEditor
        .diagnose({
          code: 'import { Heart } from "lucide-react"; const view = <Heart size={24} />;',
          filepath: "App.tsx",
          files: [],
        })
        .filter((problem) => problem.severity !== "hint")
    ).toEqual([]);
  });

  it("uses a virtual tsconfig when checking editor files", () => {
    const code = "const greet = (name) => name;";
    const files = [{ name: "tsconfig.json", code: '{"compilerOptions":{"strict":false}}' }];
    expect(errors({ code, filepath: "App.tsx", files })).toEqual([]);
    expect(errors({ code, filepath: "App.tsx", files: [] })[0]?.message).toContain("TS7006");
  });
});

describe("editor language service parity with VS Code", () => {
  const editor = createTypeScriptEditorService(libraries);
  const at = (code: string, filepath = "main.ts") => ({ code, filepath, files: [] });

  it("filters completions by prefix before limiting the list", () => {
    const code = "document.querySel";
    const labels = editor.complete(at(code), code.length).map(({ label }) => label);
    expect(labels.slice(0, 2).sort()).toEqual(["querySelector", "querySelectorAll"]);
  });

  it("matches word starts fuzzily, like VS Code's suggest widget", () => {
    const code = "gcs";
    const labels = editor.complete(at(code), code.length).map(({ label }) => label);
    expect(labels).toContain("getComputedStyle");
    expect(labels).not.toContain("console");
  });

  it("reaches globals late in the alphabet", () => {
    const code = "setTime";
    expect(editor.complete(at(code), code.length).map(({ label }) => label)).toContain(
      "setTimeout"
    );
  });

  it("knows modern standard library methods", () => {
    const problems = editor
      .diagnose(at("const sorted = [3, 1].toSorted(); const g = Object.groupBy([1], (n) => n);"))
      .filter((problem) => problem.severity !== "hint");
    expect(problems).toEqual([]);
  });

  it("reports undefined names in JavaScript without inference noise", () => {
    const messages = editor
      .diagnose(
        at(
          'import { useState } from "react";\nexport function A() {\n  const [data, setData] = useState(null);\n  setData({ id: 1 });\n  return missingValue + data;\n}',
          "A.jsx"
        )
      )
      .filter((problem) => problem.severity !== "hint")
      .map(({ message }) => message);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain("TS2304");
  });

  it("returns ranges and marks unused declarations as hints", () => {
    const code = "const unused = 1;\nconst value: number = missing;\nexport { value };";
    const problems = editor.diagnose(at(code));
    const error = problems.find(({ code: errorCode }) => errorCode === 2304);
    expect(error && code.slice(error.start, error.end)).toBe("missing");
    const hint = problems.find(({ severity }) => severity === "hint");
    expect(hint && code.slice(hint.start, hint.end)).toBe("unused");
  });

  it("offers an import quick fix for a React hook", () => {
    const code = "export const useCounter = () => useState(0);";
    const problem = editor.diagnose(at(code, "use-counter.ts")).find((item) => item.code === 2304);
    expect(problem).toBeDefined();
    if (!problem) return;
    const fixes = editor.codefix(
      at(code, "use-counter.ts"),
      problem.start,
      problem.end,
      problem.code
    );
    const importFix = fixes.find(({ description }) => description.includes("react"));
    expect(importFix?.changes[0].newText).toContain('import { useState } from "react"');
  });

  it("suggests the spelling fix for a typo", () => {
    const code = "const total = 1;\nexport const twice = totl * 2;";
    const problem = editor.diagnose(at(code)).find((item) => item.code === 2552);
    expect(problem).toBeDefined();
    if (!problem) return;
    const fixes = editor.codefix(at(code), problem.start, problem.end, problem.code);
    expect(fixes[0]?.changes[0].newText).toBe("total");
  });

  it("checks JavaScript scoping like the removed heuristic linter did", () => {
    const errorsOf = (code: string) =>
      editor
        .diagnose(at(code, "solution.js"))
        .filter((problem) => problem.severity === "error")
        .map(({ code: errorCode }) => errorCode);
    expect(
      errorsOf("for (let i = 0; i < 2; i++) {}\nfor (let i = 0; i < 3; i++) {}\nexport {};")
    ).toEqual([]);
    expect(errorsOf("var x = 10;\nvar x = 20;\nexport { x };")).toEqual([]);
    expect(errorsOf("const z = 1;\nconst z = 2;\nexport { z };")).toContain(2451);
  });

  it("finds a definition in another editor file", () => {
    const code = 'import { helper } from "./utils";\nhelper();';
    const location = editor.definition(
      {
        code,
        filepath: "main.ts",
        files: [{ name: "utils.ts", code: "export const helper = () => 1;" }],
      },
      code.lastIndexOf("helper") + 1
    );
    expect(location).toEqual({ filepath: "utils.ts", start: 13, end: 19 });
  });
});
