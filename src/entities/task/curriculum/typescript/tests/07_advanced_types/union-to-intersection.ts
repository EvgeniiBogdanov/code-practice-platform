describe("UnionToIntersection", () => {
  test("превращает объединение в пересечение", () => {
    type _ = Expect<Equal<UnionToIntersection<{ a: 1 } | { b: 2 }>, { a: 1 } & { b: 2 }>>;
  });

  test("для одного типа возвращает его же", () => {
    type _ = Expect<Equal<UnionToIntersection<{ a: 1 }>, { a: 1 }>>;
  });
});

describe("combine", () => {
  test("результат содержит методы всех плагинов с их типами", () => {
    api.log("Старт");
    const timestamp: number = api.now();
    const value: number = api.random(10);
  });

  test("методы вызываются только с аргументами своего типа", () => {
    // @ts-expect-error
    api.random("10");
    // @ts-expect-error
    api.log(42);
  });

  test("методов, которых не было у плагинов, нет", () => {
    // @ts-expect-error
    api.missing();
  });
});
