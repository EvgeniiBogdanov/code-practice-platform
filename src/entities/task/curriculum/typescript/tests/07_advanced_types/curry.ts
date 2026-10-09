test("каждый шаг принимает один аргумент", () => {
  const add = curry((a: number, b: number): number => a + b);
  const addOne = add(1);
  const sum: number = addOne(2);
});

test("итог имеет тип результата исходной функции", () => {
  const text: string = format(3)("кг")(true);
  // @ts-expect-error
  const wrong: number = format(3)("кг")(true);
});

test("неверный тип аргумента на любом шаге — ошибка", () => {
  // @ts-expect-error
  format("3");
  // @ts-expect-error
  format(3)(1);
  // @ts-expect-error
  format(3)("кг")("да");
});
