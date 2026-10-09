describe("assert", () => {
  test("сужает тип значения после вызова", () => {
    const requireText = (value: string | undefined): string => {
      assert(value !== undefined, "Значение не задано");
      return value;
    };
  });

  test("принимает условие и сообщение", () => {
    assert(true, "Всё хорошо");
    // @ts-expect-error
    assert(true);
  });
});

describe("assertIsString", () => {
  test("сужает unknown до string после вызова", () => {
    const requireString = (value: unknown): string => {
      assertIsString(value);
      return value;
    };
  });

  test("принимает значение любого типа", () => {
    assertIsString("text");
    assertIsString(42);
    assertIsString(null);
  });
});

test("getApiUrl и shout возвращают строки", () => {
  const url: string = getApiUrl({ API_URL: "HTTPS://API.EXAMPLE.COM" });
  const text: string = shout("hello");
});
