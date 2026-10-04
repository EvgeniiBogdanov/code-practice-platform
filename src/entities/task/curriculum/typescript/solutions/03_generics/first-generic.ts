const first = <T>(items: readonly T[]): T | undefined => items[0];

const last = <T>(items: readonly T[]): T | undefined => items[items.length - 1];

const wrapInArray = <T>(value: T): T[] => [value];

const n = first([1, 2, 3]); // number | undefined
const s = last(["a", "b"]); // string | undefined
const w = wrapInArray({ id: 1 }); // { id: number }[]
