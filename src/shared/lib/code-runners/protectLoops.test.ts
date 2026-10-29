import { describe, expect, it } from "vitest";
import { normalizeAndProtectLoops } from "./protectLoops";
import { transpileCode } from "./transpiler";

/** Transpiles like the runners do and returns the module's `result` export. */
const run = (source: string, clock: Pick<DateConstructor, "now"> = Date): unknown => {
  const { code, error } = transpileCode(source, "main.ts");
  if (error) throw error;
  const moduleExports: Record<string, unknown> = {};
  new Function("exports", "Date", code ?? "")(moduleExports, clock);
  return moduleExports.result;
};

const countGuards = (source: string): number =>
  normalizeAndProtectLoops(source).match(/_lc_\d+ = 0/g)?.length ?? 0;

describe("normalizeAndProtectLoops", () => {
  it("guards for, while and do-while loops and keeps them working", () => {
    const source = [
      "let sum = 0;",
      "for (let i = 0; i < 3; i++) { sum += i; }",
      "let j = 0;",
      "while (j < 3) { j++; }",
      "let k = 0;",
      "do { k++; } while (k < 3);",
      "export const result = [sum, j, k];",
    ].join("\n");

    expect(countGuards(source)).toBe(3);
    expect(run(source)).toEqual([3, 3, 3]);
  });

  it("handles loop headers with nested parentheses", () => {
    const source = [
      "const deps = new Map([['a', { deps: ['x', 'y'] }]]);",
      "const seen: string[] = [];",
      "for (const dep of deps.get('a')?.deps ?? []) seen.push(dep);",
      "let total = 0;",
      "for (const n of [1, 2].map((value) => value * 2)) { total += n; }",
      "export const result = [seen, total];",
    ].join("\n");

    expect(countGuards(source)).toBe(2);
    expect(run(source)).toEqual([["x", "y"], 6]);
  });

  it("guards a one-line body that holds a semicolon in a string", () => {
    const source = [
      "let text = '';",
      'for (let i = 0; i < 2; i++) text += ";";',
      "export const result = text;",
    ].join("\n");

    expect(countGuards(source)).toBe(1);
    expect(run(source)).toBe(";;");
  });

  it("keeps a guarded loop a single statement after if, else and case", () => {
    const source = [
      "let n = 0;",
      "let m = 0;",
      "if (n === 0) for (let i = 0; i < 2; i++) { n++; }",
      "else while (m < 2) m++;",
      "switch (n) {",
      "  case 2: for (let i = 0; i < 3; i++) { m++; }",
      "    break;",
      "  default: while (m < 10) { m++; }",
      "}",
      "export const result = [n, m];",
    ].join("\n");

    expect(countGuards(source)).toBe(4);
    expect(run(source)).toEqual([2, 3]);
  });

  it("keeps labels on their loops", () => {
    const source = [
      "let hits = 0;",
      "outer: for (let i = 0; i < 3; i++) {",
      "  for (let j = 0; j < 3; j++) { if (j === 1) continue outer; hits++; }",
      "}",
      "export const result = hits;",
    ].join("\n");

    expect(countGuards(source)).toBe(2);
    expect(run(source)).toBe(3);
  });

  it("does not mistake the tail of do-while for a loop", () => {
    const source = [
      "let a = 0;",
      "let b = 0;",
      "do { a++; } while (a < 3)",
      "b++;",
      "export const result = [a, b];",
    ].join("\n");

    expect(countGuards(source)).toBe(1);
    expect(run(source)).toEqual([3, 1]);
  });

  it("leaves loop-like text in strings, comments, templates and regexes alone", () => {
    const source = [
      'const s = "for (;;) {";',
      "// while (true) {}",
      "/* do { } while (x); */",
      "const t = `while (x) { ${'for (;;) {'} }`;",
      "const r = /for \\(x\\) \\{/;",
      "[1].forEach((x) => x);",
      "const o = { for: 1, while: 2 };",
    ].join("\n");

    expect(normalizeAndProtectLoops(source)).toBe(source);
  });

  it("keeps every line in place, so error lines still match the source", () => {
    const source = [
      "for (let i = 0; i < 1; i++) {",
      "  let j = 0;",
      "  while (j < 1) j++;",
      "}",
      "throw new Error('line 5');",
    ].join("\n");
    const lines = normalizeAndProtectLoops(source).split("\n");

    expect(lines).toHaveLength(5);
    expect(lines[2]).toContain("j++");
    expect(lines[4]).toBe("throw new Error('line 5');");
  });

  it("guards for await loops", () => {
    const source = "async function f(xs) { for await (const x of xs) { console.log(x); } }";
    expect(countGuards(source)).toBe(1);
    expect(transpileCode(source, "main.ts").error).toBeNull();
  });

  it("stops a loop that runs too long", () => {
    let now = 0;
    const clock = { now: (): number => (now += 1000) };
    expect(() => run("while (true) {}", clock)).toThrow(/бесконечный цикл/);
  });
});
