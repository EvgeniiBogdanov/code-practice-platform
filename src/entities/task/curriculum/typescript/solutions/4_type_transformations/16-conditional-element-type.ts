type ElementType<T> = T extends (infer U)[] ? U : T;

type A = number[];
type B = string;

type AElement = ElementType<A>; // number
type BElement = ElementType<B>; // string
