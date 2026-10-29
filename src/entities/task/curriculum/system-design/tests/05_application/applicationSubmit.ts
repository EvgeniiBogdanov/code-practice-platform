const start = () => {
  let keys = 0;
  return createApplicationSubmitter({
    url: "/api/applications",
    createKey: () => `key-${++keys}`,
    maxAttempts: 3,
    retryDelayMs: 1000,
  });
};

const header = (call, name) => new Headers(call.init?.headers).get(name);
const flushMicrotasks = () => clock.tick(0);

describe("запрос", () => {
  test("POST с JSON-телом и ключом идемпотентности", async () => {
    const submitter = start();
    submitter.submit({ name: "Анна", income: 90000 });
    await flushMicrotasks();
    const [call] = fetchMock.calls;
    expect(call.url).toBe("/api/applications");
    expect(call.init?.method).toBe("POST");
    expect(JSON.parse(call.init?.body)).toEqual({ name: "Анна", income: 90000 });
    expect(header(call, "Content-Type")).toBe("application/json");
    expect(header(call, "Idempotency-Key")).toBe("key-1");
  });

  test("2xx → { status: ok, id }", async () => {
    const submitter = start();
    const result = submitter.submit({ name: "Анна" });
    await flushMicrotasks();
    fetchMock.calls[0].resolve({ id: "app-42" }, { status: 201 });
    expect(await result).toEqual({ status: "ok", id: "app-42" });
  });
});

describe("двойная отправка", () => {
  test("повторный submit во время отправки возвращает тот же промис", async () => {
    const submitter = start();
    const first = submitter.submit({ name: "Анна" });
    const second = submitter.submit({ name: "Анна" });
    await flushMicrotasks();
    expect(first === second).toBe(true);
    expect(fetchMock.calls.length).toBe(1);
  });

  test("сетевая ошибка → повтор через паузу с тем же ключом", async () => {
    const submitter = start();
    const result = submitter.submit({ name: "Анна" });
    await flushMicrotasks();
    fetchMock.calls[0].reject(new TypeError("Failed to fetch"));
    await clock.tick(999);
    expect(fetchMock.calls.length).toBe(1);
    await clock.tick(1);
    expect(fetchMock.calls.length).toBe(2);
    expect(header(fetchMock.calls[1], "Idempotency-Key")).toBe("key-1");
    fetchMock.calls[1].resolve({ id: "app-1" });
    expect(await result).toEqual({ status: "ok", id: "app-1" });
  });

  test("5xx повторяется, после maxAttempts попыток — failed", async () => {
    const submitter = start();
    const result = submitter.submit({ name: "Анна" });
    for (let attempt = 0; attempt < 3; attempt++) {
      await clock.tick(attempt === 0 ? 0 : 1000);
      fetchMock.calls[attempt].resolve({ message: "unavailable" }, { status: 503 });
      await flushMicrotasks();
    }
    await clock.tick(5000);
    expect(fetchMock.calls.length).toBe(3);
    expect(await result).toEqual({ status: "failed" });
  });

  test("новый submit после failed идёт с тем же ключом", async () => {
    const submitter = start();
    const first = submitter.submit({ name: "Анна" });
    await flushMicrotasks();
    fetchMock.calls[0].resolve({ message: "bad request" }, { status: 400 });
    expect(await first).toEqual({ status: "failed" });
    submitter.submit({ name: "Анна" });
    await flushMicrotasks();
    expect(header(fetchMock.calls[1], "Idempotency-Key")).toBe("key-1");
  });
});

describe("ответы без повтора", () => {
  test("422 → ошибки по полям, у поля остаётся первая", async () => {
    const submitter = start();
    const result = submitter.submit({ inn: "123" });
    await flushMicrotasks();
    fetchMock.calls[0].resolve(
      {
        errors: [
          { field: "inn", code: "pattern" },
          { field: "inn", code: "notFound" },
          { field: "income", code: "min" },
        ],
      },
      { status: 422 }
    );
    expect(await result).toEqual({
      status: "invalid",
      errors: { inn: "pattern", income: "min" },
    });
    await clock.tick(5000);
    expect(fetchMock.calls.length).toBe(1);
  });

  test("прочие 4xx → failed без повтора", async () => {
    const submitter = start();
    const result = submitter.submit({ name: "Анна" });
    await flushMicrotasks();
    fetchMock.calls[0].resolve({ message: "forbidden" }, { status: 403 });
    expect(await result).toEqual({ status: "failed" });
    await clock.tick(5000);
    expect(fetchMock.calls.length).toBe(1);
  });

  test("после ok и после 422 следующий submit получает новый ключ", async () => {
    const submitter = start();
    const first = submitter.submit({ inn: "123" });
    await flushMicrotasks();
    fetchMock.calls[0].resolve({ errors: [{ field: "inn", code: "pattern" }] }, { status: 422 });
    await first;
    const second = submitter.submit({ inn: "123456789012" });
    await flushMicrotasks();
    fetchMock.calls[1].resolve({ id: "app-7" });
    await second;
    submitter.submit({ inn: "123456789012" });
    await flushMicrotasks();
    expect(fetchMock.calls.map((call) => header(call, "Idempotency-Key"))).toEqual([
      "key-1",
      "key-2",
      "key-3",
    ]);
  });
});
