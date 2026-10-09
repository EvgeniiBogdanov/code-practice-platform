test("getValue возвращает тип поля по ключу", () => {
  const a: number = getValue(obj, "a");
  const c: string = getValue(obj, "c");
});

test("getValue не подменяет тип поля другим", () => {
  // @ts-expect-error
  const wrong: string = getValue(obj, "a");
});

test("getValue принимает только существующие ключи", () => {
  // @ts-expect-error
  getValue(obj, "z");
});
