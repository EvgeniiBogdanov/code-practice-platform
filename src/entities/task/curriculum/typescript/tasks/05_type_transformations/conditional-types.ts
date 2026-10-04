// Реализуйте типы-помощники на основе условных типов (без infer):
//
// IsString<T>      — true, если T является строкой, иначе false;
// MyNonNullable<T> — убирает null и undefined из T (без встроенного NonNullable);
// TypeName<T>      — "string" | "number" | "boolean" | "function" | "object"
//                    в зависимости от T, по аналогии с оператором typeof.

type IsString<T> = unknown;
type MyNonNullable<T> = unknown;
type TypeName<T> = unknown;

// IsString<"hello">                 → true
// IsString<42>                      → false
// MyNonNullable<string | null>      → string
// TypeName<() => void>              → "function"
// TypeName<string[]>                → "object"
