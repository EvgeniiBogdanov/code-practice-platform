describe("ElementType", () => {
  test("извлекает тип элемента массива", () => {
    type _ = Expect<Equal<ElementType<number[]>, number>>;
    type __ = Expect<Equal<ElementType<(string | number)[]>, string | number>>;
  });

  test("вложенный массив даёт массив-элемент", () => {
    type _ = Expect<Equal<ElementType<string[][]>, string[]>>;
  });

  test("не массив возвращается без изменений", () => {
    type _ = Expect<Equal<ElementType<string>, string>>;
    type __ = Expect<Equal<ElementType<{ id: number }>, { id: number }>>;
  });
});
