type IsString<T> = T extends string ? true : false;

type MyNonNullable<T> = T extends null | undefined ? never : T;

type TypeName<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : T extends (...args: never[]) => unknown
        ? "function"
        : "object";

type A = IsString<"hello">; // true
type B = IsString<42>; // false
type C = IsString<string | number>; // boolean — распределение по объединению
type D = MyNonNullable<string | null | undefined>; // string
type E = TypeName<() => void>; // "function"
type F = TypeName<string[]>; // "object"
type G = TypeName<string | number>; // "string" | "number"
