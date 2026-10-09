test("first сохраняет тип элементов", () => {
  const number: number | undefined = first([1, 2, 3]);
  // @ts-expect-error
  const wrong: string | undefined = first([1, 2, 3]);
});

test("last сохраняет тип элементов", () => {
  const text: string | undefined = last(["a", "b"]);
  // @ts-expect-error
  const wrong: number | undefined = last(["a", "b"]);
});

test("wrapInArray оборачивает значение с сохранением типа", () => {
  const wrapped: { id: number }[] = wrapInArray({ id: 1 });
  // @ts-expect-error
  const wrong: string[] = wrapInArray({ id: 1 });
});
