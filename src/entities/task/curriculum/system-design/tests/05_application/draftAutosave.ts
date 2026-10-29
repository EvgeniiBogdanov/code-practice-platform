// Управляемое сохранение: каждый вызов save ждёт, пока тест его завершит.
const start = () => {
  const saves = [];
  const statuses = [];
  const autosave = createDraftAutosave(
    (values, version) =>
      new Promise((resolve, reject) => {
        saves.push({ values, version, resolve, reject });
      }),
    { delayMs: 1000, version: 1, onStatus: (status) => statuses.push(status) }
  );
  const flushMicrotasks = () => clock.tick(0);
  return { autosave, saves, statuses, flushMicrotasks };
};

describe("пауза в вводе", () => {
  test("сохранение уходит только после паузы", async () => {
    const { autosave, saves } = start();
    autosave.change({ name: "Анна" });
    await clock.tick(999);
    expect(saves.length).toBe(0);
    await clock.tick(1);
    expect(saves.length).toBe(1);
    expect(saves[0].values).toEqual({ name: "Анна" });
    expect(saves[0].version).toBe(1);
  });

  test("серия изменений даёт одно сохранение с последними значениями", async () => {
    const { autosave, saves } = start();
    autosave.change({ name: "А" });
    await clock.tick(500);
    autosave.change({ name: "Ан" });
    await clock.tick(500);
    autosave.change({ name: "Анна" });
    await clock.tick(1000);
    expect(saves.map((call) => call.values)).toEqual([{ name: "Анна" }]);
  });
});

describe("версия и очередь", () => {
  test("следующее сохранение отправляет версию из ответа сервера", async () => {
    const { autosave, saves, flushMicrotasks } = start();
    autosave.change({ step: 1 });
    await clock.tick(1000);
    saves[0].resolve({ version: 2 });
    await flushMicrotasks();
    autosave.change({ step: 2 });
    await clock.tick(1000);
    expect(saves[1].version).toBe(2);
  });

  test("пока запрос в полёте, второй не уходит; изменения сохраняются после него", async () => {
    const { autosave, saves, flushMicrotasks } = start();
    autosave.change({ name: "Анна" });
    await clock.tick(1000);
    autosave.change({ name: "Анна", phone: "+7" });
    await clock.tick(5000);
    expect(saves.length).toBe(1);
    saves[0].resolve({ version: 2 });
    await flushMicrotasks();
    expect(saves.length).toBe(2);
    expect(saves[1].values).toEqual({ name: "Анна", phone: "+7" });
    expect(saves[1].version).toBe(2);
  });
});

describe("flush", () => {
  test("flush сохраняет сразу и завершается после ответа", async () => {
    const { autosave, saves, flushMicrotasks } = start();
    autosave.change({ step: "income" });
    let done = false;
    autosave.flush().then(() => {
      done = true;
    });
    await flushMicrotasks();
    expect(saves.length).toBe(1);
    expect(done).toBe(false);
    saves[0].resolve({ version: 2 });
    await flushMicrotasks();
    expect(done).toBe(true);
    await clock.tick(5000);
    expect(saves.length).toBe(1);
  });

  test("flush без изменений завершается сразу и ничего не отправляет", async () => {
    const { autosave, saves, statuses } = start();
    await autosave.flush();
    expect(saves.length).toBe(0);
    expect(statuses).toEqual([]);
  });

  test("flush во время запроса ждёт и его, и сохранение новых изменений", async () => {
    const { autosave, saves, flushMicrotasks } = start();
    autosave.change({ a: 1 });
    await clock.tick(1000);
    autosave.change({ a: 2 });
    let done = false;
    autosave.flush().then(() => {
      done = true;
    });
    saves[0].resolve({ version: 2 });
    await flushMicrotasks();
    expect(done).toBe(false);
    expect(saves[1].values).toEqual({ a: 2 });
    saves[1].resolve({ version: 3 });
    await flushMicrotasks();
    expect(done).toBe(true);
  });
});

describe("статусы и ошибки", () => {
  test("saving перед запросом, saved после ответа", async () => {
    const { autosave, saves, statuses, flushMicrotasks } = start();
    autosave.change({ a: 1 });
    await clock.tick(1000);
    expect(statuses).toEqual(["saving"]);
    saves[0].resolve({ version: 2 });
    await flushMicrotasks();
    expect(statuses).toEqual(["saving", "saved"]);
  });

  test("после отказа значения не теряются: flush отправляет их снова с прежней версией", async () => {
    const { autosave, saves, statuses, flushMicrotasks } = start();
    autosave.change({ a: 1 });
    await clock.tick(1000);
    saves[0].reject(new Error("offline"));
    await flushMicrotasks();
    expect(statuses).toEqual(["saving", "error"]);
    autosave.flush();
    await flushMicrotasks();
    expect(saves.length).toBe(2);
    expect(saves[1].values).toEqual({ a: 1 });
    expect(saves[1].version).toBe(1);
  });

  test("отказ не затирает изменения, пришедшие во время запроса", async () => {
    const { autosave, saves, flushMicrotasks } = start();
    autosave.change({ a: 1 });
    await clock.tick(1000);
    autosave.change({ a: 2 });
    saves[0].reject(new Error("offline"));
    await flushMicrotasks();
    autosave.flush();
    await flushMicrotasks();
    expect(saves[saves.length - 1].values).toEqual({ a: 2 });
  });
});
