// Любая функция совместима с этим типом: параметры сравниваются контравариантно,
// а never можно передать в параметр любого типа.
type AnyFunction = (...args: never[]) => unknown;

type MyReturnType<F extends AnyFunction> = F extends (...args: never[]) => infer R ? R : never;

type MyParameters<F extends AnyFunction> = F extends (...args: infer P) => unknown ? P : never;

type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T;

type FirstArg<F extends AnyFunction> = F extends (first: infer A, ...rest: never[]) => unknown
  ? A
  : never;

const log = (data: string[], count: number): boolean => data.length > count;

type R = MyReturnType<typeof log>; // boolean
type P = MyParameters<typeof log>; // [data: string[], count: number]
type W = MyAwaited<Promise<Promise<number>>>; // number
type A = FirstArg<typeof log>; // string[]
// MyReturnType<string> — ошибка: string не является функцией (проверяется в tests.ts)
