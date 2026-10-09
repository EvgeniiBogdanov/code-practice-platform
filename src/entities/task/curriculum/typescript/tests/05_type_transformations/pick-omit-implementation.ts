describe("MyPick", () => {
  test("оставляет только перечисленные ключи", () => {
    type _ = Expect<Equal<Credentials, { name: string; password: string }>>;
  });

  test("сохраняет readonly и необязательность полей", () => {
    type _ = Expect<
      Equal<MyPick<User, "id" | "email">, { readonly id: number; email?: string }>
    >;
  });

  test("принимает только существующие ключи", () => {
    // @ts-expect-error
    type Broken = MyPick<User, "age">;
  });
});

describe("MyOmit", () => {
  test("убирает перечисленные ключи и сохраняет модификаторы", () => {
    type _ = Expect<Equal<PublicUser, { readonly id: number; name: string; email?: string }>>;
  });
});

describe("StrictOmit", () => {
  test("работает как MyOmit для существующих ключей", () => {
    type _ = Expect<Equal<StrictOmit<User, "password">, PublicUser>>;
  });

  test("отклоняет несуществующие ключи", () => {
    // @ts-expect-error
    type Typo = StrictOmit<User, "pasword">;
  });
});
