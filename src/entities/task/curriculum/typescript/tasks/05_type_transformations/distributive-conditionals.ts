// 1. ToArray<string | number> даёт string[] | number[].
//    Реализуйте ToArrayNonDist, который даёт (string | number)[].
// 2. IsNever<T> должен возвращать true только для never.
//    Наивная версия ниже для never возвращает never — исправьте её.
// 3. Реализуйте IsUnion<T>: true, если T — объединение нескольких типов.

type ToArray<T> = T extends unknown ? T[] : never;
type ToArrayNonDist<T> = unknown;

type IsNever<T> = T extends never ? true : false;

type IsUnion<T> = unknown;

// ToArray<string | number>         → string[] | number[]
// ToArrayNonDist<string | number>  → (string | number)[]
// IsNever<never>                   → true
// IsNever<string>                  → false
// IsUnion<string | number>         → true
// IsUnion<string>                  → false
// IsUnion<never>                   → false
