test("результат parseJson нельзя использовать без проверки", () => {
  const data = parseJson('{"name": "alice"}');
  // @ts-expect-error
  data.name;
});

test("после вызова fail выполнение не продолжается", () => {
  const ensure = (value: string | undefined): string => {
    if (value === undefined) fail("нет значения");
    return value;
  };
});

test("getUserName принимает JSON и возвращает строку", () => {
  const name: string = getUserName('{"name": "alice"}');
});
