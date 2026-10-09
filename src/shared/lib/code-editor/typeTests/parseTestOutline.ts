export interface TestOutlineItem {
  /** Same key as `TypeTestCase.id`: `${describe}/${name}`. */
  id: string;
  name: string;
  describe: string | null;
  line: number;
}

const STATEMENT = /^([ \t]*)(describe|test)\(\s*(["'`])((?:\\.|(?!\3).)*)\3/;

/**
 * Lists the tests of `tests.ts` without a TypeScript parser, so the panel can show them as
 * requirements before the first run. `tests.ts` has a rigid shape (only `describe`/`test` calls,
 * one per line), which a CI test keeps in sync with the real parser.
 */
export const parseTestOutline = (source: string): TestOutlineItem[] => {
  const items: TestOutlineItem[] = [];
  let group: string | null = null;
  source.split("\n").forEach((line, index) => {
    const match = STATEMENT.exec(line);
    if (!match) return;
    const [, indent, kind, , rawName] = match;
    const name = rawName.replace(/\\(.)/g, "$1");
    if (kind === "describe") {
      group = name;
      return;
    }
    const describe = indent.length > 0 ? group : null;
    items.push({ id: `${describe ?? ""}/${name}`, name, describe, line: index + 1 });
  });
  return items;
};
