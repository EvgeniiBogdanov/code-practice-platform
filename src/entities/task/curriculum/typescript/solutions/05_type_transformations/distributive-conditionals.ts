type ToArray<T> = T extends unknown ? T[] : never;

// Кортеж из одного элемента — уже не голый параметр типа, распределения нет.
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;

type IsNever<T> = [T] extends [never] ? true : false;

// U хранит исходное объединение целиком, а T распределяется по вариантам.
// Если хотя бы один вариант не равен всему объединению, T — объединение.
type IsUnion<T, U = T> =
  IsNever<T> extends true ? false : T extends unknown ? ([U] extends [T] ? false : true) : never;

type A = ToArray<string | number>; // string[] | number[]
type B = ToArrayNonDist<string | number>; // (string | number)[]
type C = IsNever<never>; // true
type D = IsNever<string>; // false
type E = IsUnion<string | number>; // true
type F = IsUnion<string>; // false
type G = IsUnion<never>; // false
type H = IsUnion<boolean>; // true: boolean — это true | false
