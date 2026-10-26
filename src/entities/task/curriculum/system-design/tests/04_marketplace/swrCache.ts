describe("первая загрузка", () => {
  test("без записи ждём ответ сервера", async () => {
    const calls: string[] = [];
    const cache = createSwrCache(async (key: string) => {
      calls.push(key);
      return `v:${key}`;
    }, { staleMs: 1000 });
    expect(await cache.get("a")).toBe("v:a");
    expect(calls).toEqual(["a"]);
  });
});

describe("свежие данные", () => {
  test("свежая запись отдаётся без запроса", async () => {
    const calls: string[] = [];
    const cache = createSwrCache(async (key: string) => {
      calls.push(key);
      return key;
    }, { staleMs: 1000 });
    await cache.get("a");
    await clock.tick(999);
    expect(await cache.get("a")).toBe("a");
    expect(calls).toEqual(["a"]);
  });
});

describe("устаревшие данные", () => {
  test("устаревшее значение отдаётся сразу, обновление идёт в фоне", async () => {
    let version = 1;
    const cache = createSwrCache(async () => version, { staleMs: 1000 });
    expect(await cache.get("a")).toBe(1);
    version = 2;
    await clock.tick(1000);
    expect(await cache.get("a")).toBe(1);
    await clock.tick(0);
    expect(await cache.get("a")).toBe(2);
  });

  test("параллельные обращения к устаревшему ключу дают одно обновление", async () => {
    const calls: string[] = [];
    const cache = createSwrCache(async (key: string) => {
      calls.push(key);
      return key;
    }, { staleMs: 1000 });
    await cache.get("a");
    await clock.tick(1000);
    await cache.get("a");
    await cache.get("a");
    await clock.tick(0);
    expect(calls).toEqual(["a", "a"]);
  });

  test("ошибка фонового обновления не затирает запись", async () => {
    let calls = 0;
    const cache = createSwrCache(async () => {
      calls++;
      if (calls > 1) throw new Error("down");
      return "ok";
    }, { staleMs: 1000 });
    await cache.get("a");
    await clock.tick(1000);
    expect(await cache.get("a")).toBe("ok");
    await clock.tick(0);
    expect(await cache.get("a")).toBe("ok");
  });
});

describe("инвалидация", () => {
  test("invalidate удаляет запись: следующий get ждёт сервер", async () => {
    let version = 1;
    const cache = createSwrCache(async () => version, { staleMs: 1000 });
    await cache.get("a");
    version = 2;
    cache.invalidate("a");
    expect(await cache.get("a")).toBe(2);
  });
});
