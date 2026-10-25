const make = () => createEntityStore();

describe("хранение", () => {
  test("добавляет сущности и отдаёт их по id", () => {
    const store = make();
    store.upsertMany([{ id: "1", text: "привет", likes: 0 }]);
    expect(store.getById("1")).toEqual({ id: "1", text: "привет", likes: 0 });
    expect(store.getById("2")).toBe(undefined);
  });

  test("getAll возвращает сущности в порядке id и пропускает неизвестные", () => {
    const store = make();
    store.upsertMany([
      { id: "1", text: "a" },
      { id: "2", text: "b" },
    ]);
    expect(store.getAll(["2", "x", "1"]).map((item) => item.id)).toEqual(["2", "1"]);
  });

  test("remove удаляет сущность", () => {
    const store = make();
    store.upsertMany([{ id: "1", text: "a" }]);
    store.remove("1");
    expect(store.getById("1")).toBe(undefined);
  });
});

describe("объединение полей", () => {
  test("частичное обновление не стирает остальные поля", () => {
    const store = make();
    store.upsertMany([{ id: "1", text: "привет", likes: 0 }]);
    store.upsertMany([{ id: "1", likes: 5 }]);
    expect(store.getById("1")).toEqual({ id: "1", text: "привет", likes: 5 });
  });
});

describe("постоянство ссылок", () => {
  test("неизменившаяся сущность остаётся тем же объектом", () => {
    const store = make();
    store.upsertMany([{ id: "1", text: "привет", likes: 0 }]);
    const before = store.getById("1");
    store.upsertMany([{ id: "1", text: "привет", likes: 0 }]);
    expect(store.getById("1") === before).toBe(true);
  });

  test("изменившаяся сущность получает новый объект, соседние не трогаются", () => {
    const store = make();
    store.upsertMany([
      { id: "1", likes: 0 },
      { id: "2", likes: 0 },
    ]);
    const first = store.getById("1");
    const second = store.getById("2");
    store.upsertMany([{ id: "2", likes: 1 }]);
    expect(store.getById("1") === first).toBe(true);
    expect(store.getById("2") === second).toBe(false);
  });

  test("прежний объект не мутируется", () => {
    const store = make();
    store.upsertMany([{ id: "1", likes: 0 }]);
    const before = store.getById("1");
    store.upsertMany([{ id: "1", likes: 1 }]);
    expect(before).toEqual({ id: "1", likes: 0 });
  });
});

describe("подписка", () => {
  test("слушатель вызывается после реального изменения", () => {
    const store = make();
    let calls = 0;
    store.subscribe(() => calls++);
    store.upsertMany([{ id: "1", likes: 0 }]);
    store.upsertMany([{ id: "1", likes: 1 }]);
    store.remove("1");
    expect(calls).toBe(3);
  });

  test("без изменений слушатель не вызывается", () => {
    const store = make();
    store.upsertMany([{ id: "1", likes: 0 }]);
    let calls = 0;
    store.subscribe(() => calls++);
    store.upsertMany([{ id: "1", likes: 0 }]);
    store.remove("нет-такого");
    expect(calls).toBe(0);
  });

  test("после отписки слушатель молчит", () => {
    const store = make();
    let calls = 0;
    const unsubscribe = store.subscribe(() => calls++);
    unsubscribe();
    store.upsertMany([{ id: "1", likes: 0 }]);
    expect(calls).toBe(0);
  });
});
