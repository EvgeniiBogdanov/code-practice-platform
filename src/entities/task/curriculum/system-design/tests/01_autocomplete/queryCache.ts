describe("хранение", () => {
  test("отдаёт сохранённое значение и undefined для неизвестного ключа", () => {
    const cache = createQueryCache({ maxSize: 3, ttlMs: 1000 });
    cache.set("re", ["react"]);
    expect(cache.get("re")).toEqual(["react"]);
    expect(cache.get("vue")).toBe(undefined);
  });

  test("повторный set заменяет значение", () => {
    const cache = createQueryCache({ maxSize: 3, ttlMs: 1000 });
    cache.set("a", 1);
    cache.set("a", 2);
    expect(cache.get("a")).toBe(2);
    expect(cache.size()).toBe(1);
  });
});

describe("срок жизни", () => {
  test("значение живёт ttlMs и затем исчезает", async () => {
    const cache = createQueryCache({ maxSize: 3, ttlMs: 1000 });
    cache.set("a", 1);
    await clock.tick(999);
    expect(cache.get("a")).toBe(1);
    await clock.tick(1);
    expect(cache.get("a")).toBe(undefined);
  });

  test("чтение не продлевает срок жизни", async () => {
    const cache = createQueryCache({ maxSize: 3, ttlMs: 1000 });
    cache.set("a", 1);
    await clock.tick(600);
    cache.get("a");
    await clock.tick(400);
    expect(cache.get("a")).toBe(undefined);
  });

  test("повторный set продлевает срок жизни", async () => {
    const cache = createQueryCache({ maxSize: 3, ttlMs: 1000 });
    cache.set("a", 1);
    await clock.tick(600);
    cache.set("a", 2);
    await clock.tick(600);
    expect(cache.get("a")).toBe(2);
  });

  test("size не считает просроченные записи", async () => {
    const cache = createQueryCache({ maxSize: 5, ttlMs: 1000 });
    cache.set("a", 1);
    await clock.tick(500);
    cache.set("b", 2);
    await clock.tick(600);
    expect(cache.size()).toBe(1);
    expect(cache.get("b")).toBe(2);
  });
});

describe("вытеснение LRU", () => {
  test("при переполнении уходит самая давняя запись", () => {
    const cache = createQueryCache({ maxSize: 2, ttlMs: 1000 });
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    expect(cache.get("a")).toBe(undefined);
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
    expect(cache.size()).toBe(2);
  });

  test("чтение освежает запись: вытесняется не она", () => {
    const cache = createQueryCache({ maxSize: 2, ttlMs: 1000 });
    cache.set("a", 1);
    cache.set("b", 2);
    cache.get("a");
    cache.set("c", 3);
    expect(cache.get("a")).toBe(1);
    expect(cache.get("b")).toBe(undefined);
  });

  test("обновление существующего ключа никого не вытесняет", () => {
    const cache = createQueryCache({ maxSize: 2, ttlMs: 1000 });
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("a", 10);
    expect(cache.get("a")).toBe(10);
    expect(cache.get("b")).toBe(2);
  });

  test("кэш на одну запись хранит последнюю", () => {
    const cache = createQueryCache({ maxSize: 1, ttlMs: 1000 });
    cache.set("a", 1);
    cache.set("b", 2);
    expect(cache.get("a")).toBe(undefined);
    expect(cache.get("b")).toBe(2);
  });
});
