import { describe, expect, it } from "vitest";
import ts from "typescript";
import { createTypeScriptDiagnostics } from "./typescript-diagnostics";

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
