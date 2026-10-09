test("build возвращает объект со всеми добавленными полями", () => {
  const form = FormBuilder.create()
    .field("email", "")
    .field("age", 18)
    .field("subscribe", false)
    .build();
  type _ = Expect<
    Equal<Prettify<typeof form>, { email: string; age: number; subscribe: boolean }>
  >;
});

test("поля сохраняют типы значений", () => {
  const form = FormBuilder.create().field("email", "").field("age", 18).build();
  const email: string = form.email;
  const age: number = form.age;
});

test("обращение к необъявленному полю — ошибка", () => {
  const form = FormBuilder.create().field("email", "").build();
  // @ts-expect-error
  form.phone;
});

test("повторное добавление поля — ошибка", () => {
  // @ts-expect-error
  FormBuilder.create().field("email", "").field("email", "");
});
