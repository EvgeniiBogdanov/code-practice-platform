/** Names the prelude declares at module scope; a solution must not reuse them. */
export const RESERVED_TEST_NAMES: readonly string[] = [
  "Equal",
  "Expect",
  "Prettify",
  "test",
  "describe",
];

/**
 * Helpers for `tests.ts`. They exist only in the virtual document the engine assembles
 * (the shared worker also serves JS and React, where a global `test` would be noise).
 * The prelude comes first on purpose: file pragmas such as `// @ts-nocheck` count only at the
 * top of a file, so they cannot silence the checks if a solution contains one.
 */
export const TYPE_TESTS_PRELUDE = `/**
 * Точное сравнение типов: \`true\`, только если X и Y совпадают (различает any, unknown,
 * readonly и необязательные поля).
 */
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
/** Тест проходит, если аргумент — \`true\`. Иначе TypeScript сообщает об ошибке. */
type Expect<T extends true> = T;
/** Разворачивает пересечения в один объектный тип: \`{ a } & { b }\` → \`{ a; b }\`. */
type Prettify<T> = { [K in keyof T]: T[K] } & {};
/** Один проверяемый сценарий. Код внутри только проверяется на типы и не выполняется. */
declare function test(name: string, body: () => void): void;
/** Группа тестов. */
declare function describe(name: string, body: () => void): void;`;
