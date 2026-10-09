describe("First и Last", () => {
  test("возвращают крайние элементы кортежа", () => {
    type _ = Expect<Equal<First<[1, 2, 3]>, 1>>;
    type __ = Expect<Equal<Last<[1, 2, 3]>, 3>>;
  });

  test("для пустого кортежа дают never", () => {
    type _ = Expect<Equal<First<[]>, never>>;
    type __ = Expect<Equal<Last<[]>, never>>;
  });
});

test("Length возвращает длину кортежа как литерал", () => {
  type _ = Expect<Equal<Length<[1, 2, 3]>, 3>>;
  type __ = Expect<Equal<Length<[]>, 0>>;
});

test("Concat склеивает кортежи", () => {
  type _ = Expect<Equal<Concat<[1], [2, 3]>, [1, 2, 3]>>;
  type __ = Expect<Equal<Concat<[], ["a"]>, ["a"]>>;
});

test("Reverse разворачивает кортеж", () => {
  type _ = Expect<Equal<Reverse<[1, "a", true]>, [true, "a", 1]>>;
  type __ = Expect<Equal<Reverse<[]>, []>>;
});

test("concat возвращает кортеж точного вида", () => {
  const joined = concat([1, "a"], [true]);
  type _ = Expect<Equal<typeof joined, [1, "a", true]>>;
});
