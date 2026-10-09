// Альтернативный эталон: readonly-массивы тоже распознаются.
type ElementType<T> = T extends readonly (infer U)[] ? U : T;

type A = number[];
type B = string;
