describe("ToArrayNonDist", () => {
  test("не распределяется по объединению", () => {
    type _ = Expect<Equal<ToArrayNonDist<string | number>, (string | number)[]>>;
  });

  test("для одного типа даёт обычный массив", () => {
    type _ = Expect<Equal<ToArrayNonDist<string>, string[]>>;
  });
});

describe("IsNever", () => {
  test("true только для never", () => {
    type _ = Expect<Equal<IsNever<never>, true>>;
  });

  test("false для остальных типов", () => {
    type _ = Expect<Equal<IsNever<string>, false>>;
    type __ = Expect<Equal<IsNever<undefined>, false>>;
  });
});

describe("IsUnion", () => {
  test("true для объединения нескольких типов", () => {
    type _ = Expect<Equal<IsUnion<string | number>, true>>;
  });

  test("false для одного типа и для never", () => {
    type _ = Expect<Equal<IsUnion<string>, false>>;
    type __ = Expect<Equal<IsUnion<never>, false>>;
  });
});
