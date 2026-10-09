test("formatId принимает строку и возвращает строку", () => {
  const text: string = formatId("abc-1");
});

test("formatId принимает число и возвращает строку", () => {
  const text: string = formatId(42);
});

test("formatId не принимает другие типы", () => {
  // @ts-expect-error
  formatId(true);
  // @ts-expect-error
  formatId(null);
});
