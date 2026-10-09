describe("MyReturnType", () => {
  test("возвращает тип результата функции", () => {
    type _ = Expect<Equal<MyReturnType<typeof log>, boolean>>;
    type __ = Expect<Equal<MyReturnType<() => Promise<string>>, Promise<string>>>;
  });

  test("принимает только функции", () => {
    // @ts-expect-error
    type Bad = MyReturnType<string>;
  });
});

describe("MyParameters", () => {
  test("возвращает кортеж типов параметров", () => {
    type _ = Expect<Equal<MyParameters<typeof log>, [data: string[], count: number]>>;
    type __ = Expect<Equal<MyParameters<() => void>, []>>;
  });

  test("принимает только функции", () => {
    // @ts-expect-error
    type Bad = MyParameters<number>;
  });
});

test("MyAwaited разворачивает вложенные Promise", () => {
  type _ = Expect<Equal<MyAwaited<Promise<number>>, number>>;
  type __ = Expect<Equal<MyAwaited<Promise<Promise<number>>>, number>>;
  type ___ = Expect<Equal<MyAwaited<string>, string>>;
});

test("FirstArg возвращает тип первого параметра", () => {
  type _ = Expect<Equal<FirstArg<typeof log>, string[]>>;
  type __ = Expect<Equal<FirstArg<(id: number) => void>, number>>;
});
