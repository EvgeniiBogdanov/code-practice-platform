const dictionaries = {
  ru: {
    hello: "Привет, {name}!",
    items: { one: "{count} товар", few: "{count} товара", many: "{count} товаров", other: "{count} товара" },
    cartTitle: "Корзина",
  },
  en: {
    hello: "Hello, {name}!",
    items: { one: "{count} item", other: "{count} items" },
    checkout: "Checkout",
  },
};

const messagesFor = (locale: string) =>
  createMessages({ locale, fallbackLocale: "en", dictionaries });

describe("выбор языка", () => {
  test("берёт строку языка интерфейса", () => {
    expect(messagesFor("ru").t("cartTitle")).toBe("Корзина");
  });

  test("если строки нет в языке интерфейса, берёт из запасного", () => {
    expect(messagesFor("ru").t("checkout")).toBe("Checkout");
  });

  test("неизвестный ключ возвращается как есть", () => {
    expect(messagesFor("ru").t("missing.key")).toBe("missing.key");
  });
});

describe("плейсхолдеры", () => {
  test("подставляет параметры", () => {
    expect(messagesFor("ru").t("hello", { name: "Анна" })).toBe("Привет, Анна!");
  });

  test("неизвестный плейсхолдер остаётся в тексте", () => {
    expect(messagesFor("ru").t("hello")).toBe("Привет, {name}!");
  });
});

describe("плюрализация", () => {
  test("русский: 1 — одна форма, 2–4 — другая, 5 и 11 — третья", () => {
    const t = messagesFor("ru").t;
    expect(t("items", { count: 1 })).toBe("1 товар");
    expect(t("items", { count: 2 })).toBe("2 товара");
    expect(t("items", { count: 5 })).toBe("5 товаров");
    expect(t("items", { count: 11 })).toBe("11 товаров");
  });

  test("дробное число в русском берёт other", () => {
    expect(messagesFor("ru").t("items", { count: 1.5 })).toBe("1.5 товара");
  });

  test("английский: одна и другая форма", () => {
    const t = messagesFor("en").t;
    expect(t("items", { count: 1 })).toBe("1 item");
    expect(t("items", { count: 3 })).toBe("3 items");
  });
});
