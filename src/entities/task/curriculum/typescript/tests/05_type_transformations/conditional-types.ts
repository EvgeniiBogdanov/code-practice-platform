describe("IsString", () => {
  test("true для строк, false для остальных типов", () => {
    type _ = Expect<Equal<IsString<"hello">, true>>;
    type __ = Expect<Equal<IsString<string>, true>>;
    type ___ = Expect<Equal<IsString<42>, false>>;
  });

  test("распределяется по объединению", () => {
    type _ = Expect<Equal<IsString<string | number>, boolean>>;
  });
});

describe("MyNonNullable", () => {
  test("убирает null и undefined", () => {
    type _ = Expect<Equal<MyNonNullable<string | null | undefined>, string>>;
    type __ = Expect<Equal<MyNonNullable<number | null>, number>>;
  });

  test("не трогает остальные типы", () => {
    type _ = Expect<Equal<MyNonNullable<{ id: number }>, { id: number }>>;
  });
});

describe("TypeName", () => {
  test("называет примитивы и функции", () => {
    type _ = Expect<Equal<TypeName<string>, "string">>;
    type __ = Expect<Equal<TypeName<number>, "number">>;
    type ___ = Expect<Equal<TypeName<boolean>, "boolean">>;
    type ____ = Expect<Equal<TypeName<() => void>, "function">>;
  });

  test("массивы и объекты — object", () => {
    type _ = Expect<Equal<TypeName<string[]>, "object">>;
    type __ = Expect<Equal<TypeName<{ id: number }>, "object">>;
  });
});
