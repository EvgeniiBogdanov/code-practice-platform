import { describe, expect, it, vi } from "vitest";
import { canFormat, formatCode } from "./codeFormatter";

vi.setConfig({ testTimeout: 30_000 });

describe("formatCode", () => {
  it("formats TypeScript and keeps the status", async () => {
    const result = await formatCode("const a  =  {b:1}", "a.ts");
    expect(result.code).toBe("const a = { b: 1 };");
    expect(result.status).toBe("formatted");
  });

  it("formats SCSS with // comments and LESS with variables", async () => {
    const scss = await formatCode(".a { // note\n color:red }", "a.scss");
    expect(scss.status).toBe("formatted");
    expect(scss.code).toContain("// note");
    const less = await formatCode("@c:red;\n.a{color:@c}", "a.less");
    expect(less.status).toBe("formatted");
    expect(less.code).toContain("color: @c;");
  });

  it("says when a language has no formatter instead of silently doing nothing", async () => {
    expect(canFormat("q.sql")).toBe(false);
    expect(canFormat("a.txt")).toBe(false);
    expect(canFormat("a.tsx")).toBe(true);
    expect(await formatCode("select 1", "q.sql")).toMatchObject({ status: "unsupported" });
  });

  it("keeps the source and reports a syntax error", async () => {
    const source = "const = ;";
    expect(await formatCode(source, "a.ts")).toEqual({
      code: source,
      cursorOffset: 0,
      status: "syntax-error",
    });
  });
});
