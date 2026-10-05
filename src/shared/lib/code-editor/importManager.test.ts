import { describe, expect, it } from "vitest";
import { addImportToFile } from "./importManager";

describe("addImportToFile", () => {
  it("adds a new import using double quotes by default", () => {
    expect(addImportToFile("const a = 1;", "useState", "react").newCode).toBe(
      'import { useState } from "react";\nconst a = 1;'
    );
  });

  it("follows the quote and semicolon style of the file", () => {
    const code = "import a from 'a'\nuse(a)";
    expect(addImportToFile(code, "useState", "react").newCode).toBe(
      "import a from 'a'\nimport { useState } from 'react'\nuse(a)"
    );
  });

  it("merges into an existing import of the same module", () => {
    expect(addImportToFile('import { useState } from "react";', "useEffect", "react").newCode).toBe(
      'import { useState, useEffect } from "react";'
    );
    expect(addImportToFile('import React from "react";', "useState", "react").newCode).toBe(
      'import React, { useState } from "react";'
    );
  });

  it("merges into a multi-line import and inserts after one", () => {
    const code = 'import {\n  a,\n  b,\n} from "./x";\nconst z = 1;';
    expect(addImportToFile(code, "c", "./x").newCode).toContain('import { a, b, c } from "./x";');
    const other = addImportToFile(code, "useState", "react").newCode;
    expect(other).toBe(
      'import {\n  a,\n  b,\n} from "./x";\nimport { useState } from "react";\nconst z = 1;'
    );
  });

  it("does not treat a name in another statement as imported", () => {
    const code = 'import a from "a"\nconst useState = 1;\nimport b from "b"';
    expect(addImportToFile(code, "useState", "react").newCode).toContain(
      'import { useState } from "react"'
    );
  });

  it("does nothing when the name is already imported, also under type-only", () => {
    const code = 'import { useState } from "react";\n';
    expect(addImportToFile(code, "useState", "react").insertedLength).toBe(0);
    expect(addImportToFile('import type { Foo } from "./x";', "Foo", "./x").insertedLength).toBe(0);
  });

  it("does not merge a value into a type-only or namespace import", () => {
    expect(addImportToFile('import type { A } from "./x";', "b", "./x").newCode).toBe(
      'import type { A } from "./x";\nimport { b } from "./x";'
    );
    expect(addImportToFile('import * as R from "react";', "useState", "react").newCode).toContain(
      'import { useState } from "react";'
    );
  });

  it("adds a default import and places it below leading comments", () => {
    expect(addImportToFile("// note\nconst a = 1;", "Card", "./Card", true).newCode).toBe(
      '// note\nimport Card from "./Card";\nconst a = 1;'
    );
  });

  it("escapes symbols containing $", () => {
    expect(addImportToFile("", "$store", "./s").newCode).toBe('import { $store } from "./s";\n');
  });
});
