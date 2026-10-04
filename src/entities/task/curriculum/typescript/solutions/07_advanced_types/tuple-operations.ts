type First<T extends readonly unknown[]> = T extends readonly [infer F, ...unknown[]] ? F : never;

type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L : never;

type Length<T extends readonly unknown[]> = T["length"];

type Concat<A extends readonly unknown[], B extends readonly unknown[]> = [...A, ...B];

type Reverse<T extends readonly unknown[]> = T extends readonly [infer F, ...infer Rest]
  ? [...Reverse<Rest>, F]
  : [];

const concat = <const A extends readonly unknown[], const B extends readonly unknown[]>(
  a: A,
  b: B
): [...A, ...B] => [...a, ...b];

type T1 = First<[1, 2, 3]>; // 1
type T2 = Last<[1, 2, 3]>; // 3
type T3 = Length<[1, 2, 3]>; // 3
type T4 = Concat<[1], [2, 3]>; // [1, 2, 3]
type T5 = Reverse<[1, "a", true]>; // [true, "a", 1]
type T6 = First<[]>; // never

const joined = concat([1, "a"], [true]); // [1, "a", true]
