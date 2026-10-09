describe("Paths", () => {
  test("перечисляет все пути к полям через точку", () => {
    type _ = Expect<
      Equal<
        Paths<Settings>,
        "user" | "user.name" | "user.address" | "user.address.city" | "user.address.zip" | "theme"
      >
    >;
  });

  test("у плоского объекта пути совпадают с ключами", () => {
    type _ = Expect<Equal<Paths<{ a: number; b: string }>, "a" | "b">>;
  });
});

describe("PathValue", () => {
  test("возвращает тип значения по пути", () => {
    type _ = Expect<Equal<PathValue<Settings, "user.address.zip">, number>>;
    type __ = Expect<Equal<PathValue<Settings, "theme">, "light" | "dark">>;
    type ___ = Expect<Equal<PathValue<Settings, "user.address">, { city: string; zip: number }>>;
  });
});

describe("get", () => {
  test("возвращает значение точного типа", () => {
    const city: string = get(settings, "user.address.city");
    const zip: number = get(settings, "user.address.zip");
    // @ts-expect-error
    const wrong: number = get(settings, "user.name");
  });

  test("принимает только существующие пути", () => {
    // @ts-expect-error
    get(settings, "user.phone");
    // @ts-expect-error
    get(settings, "address");
  });
});
