describe("resolveOptions", () => {
  test("принимает любой набор полей Options, в том числе пустой", () => {
    resolveOptions({});
    resolveOptions({ retries: 5 });
    resolveOptions({ timeout: 1000, retries: 1, baseUrl: "/api" });
  });

  test("не принимает чужие поля и неверные типы", () => {
    // @ts-expect-error
    resolveOptions({ retries: "5" });
    // @ts-expect-error
    resolveOptions({ unknown: 1 });
  });

  test("результат содержит все поля и защищён от изменений", () => {
    const result = resolveOptions({ retries: 5 });
    const timeout: number = result.timeout;
    const retries: number = result.retries;
    const baseUrl: string = result.baseUrl;
    // @ts-expect-error
    result.retries = 10;
  });
});

test("StrictLegacyOptions делает все поля обязательными", () => {
  type _ = Expect<Equal<StrictLegacyOptions, { host: string; port: number }>>;
});

test("CacheKey исключает null и undefined", () => {
  type _ = Expect<Equal<CacheKey, string | number>>;
});
