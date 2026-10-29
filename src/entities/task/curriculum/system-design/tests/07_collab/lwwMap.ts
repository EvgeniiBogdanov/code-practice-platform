const op = (key, value, counter, site) => ({ key, value, clock: { counter, site } });

describe("локальные операции", () => {
  test("set записывает значение и возвращает операцию с растущими часами", () => {
    const map = createLwwMap("A");
    expect(map.set("align", "left")).toEqual(op("align", "left", 1, "A"));
    expect(map.set("color", "red")).toEqual(op("color", "red", 2, "A"));
    expect(map.get("align")).toBe("left");
    expect(map.snapshot()).toEqual({ align: "left", color: "red" });
  });

  test("remove скрывает ключ и возвращает надгробие", () => {
    const map = createLwwMap("A");
    map.set("color", "red");
    expect(map.remove("color")).toEqual(op("color", null, 2, "A"));
    expect(map.get("color")).toBe(undefined);
    expect(map.snapshot()).toEqual({});
  });
});

describe("чужие операции", () => {
  test("старшая операция побеждает, младшая отклоняется", () => {
    const map = createLwwMap("A");
    map.set("type", "paragraph");
    expect(map.apply(op("type", "heading", 2, "B"))).toBe(true);
    expect(map.get("type")).toBe("heading");
    expect(map.apply(op("type", "list", 1, "C"))).toBe(false);
    expect(map.get("type")).toBe("heading");
  });

  test("при равных counter побеждает больший site", () => {
    const map = createLwwMap("B");
    map.set("align", "center");
    expect(map.apply(op("align", "left", 1, "A"))).toBe(false);
    expect(map.apply(op("align", "right", 1, "C"))).toBe(true);
    expect(map.get("align")).toBe("right");
  });

  test("после чужой операции своя получает часы старше неё", () => {
    const map = createLwwMap("A");
    map.apply(op("type", "heading", 7, "B"));
    expect(map.set("type", "quote").clock).toEqual({ counter: 8, site: "A" });
    expect(map.get("type")).toBe("quote");
  });

  test("повторная доставка ничего не меняет", () => {
    const map = createLwwMap("A");
    const remote = op("color", "red", 3, "B");
    expect(map.apply(remote)).toBe(true);
    expect(map.apply(remote)).toBe(false);
    expect(map.snapshot()).toEqual({ color: "red" });
  });
});

describe("сходимость копий", () => {
  test("две копии с одновременными правками приходят к одному значению", () => {
    const alice = createLwwMap("alice");
    const bob = createLwwMap("bob");
    const fromAlice = alice.set("align", "left");
    const fromBob = bob.set("align", "right");
    alice.apply(fromBob);
    bob.apply(fromAlice);
    expect(alice.snapshot()).toEqual(bob.snapshot());
    expect(alice.get("align")).toBe("right");
  });

  test("порядок доставки не влияет на результат", () => {
    const ops = [
      op("type", "heading", 2, "A"),
      op("type", "list", 3, "B"),
      op("color", "red", 1, "C"),
      op("type", "quote", 3, "A"),
      op("color", null, 4, "B"),
    ];
    const orders = [
      [0, 1, 2, 3, 4],
      [4, 3, 2, 1, 0],
      [2, 4, 0, 3, 1],
      [3, 1, 4, 0, 2],
    ];
    const snapshots = orders.map((order) => {
      const map = createLwwMap("Z");
      order.forEach((index) => map.apply(ops[index]));
      return map.snapshot();
    });
    for (const snapshot of snapshots) expect(snapshot).toEqual({ type: "list" });
  });

  test("опоздавшая старая запись не воскрешает удалённый ключ", () => {
    const map = createLwwMap("A");
    map.apply(op("color", "red", 1, "B"));
    map.apply(op("color", null, 3, "C"));
    expect(map.apply(op("color", "blue", 2, "B"))).toBe(false);
    expect(map.get("color")).toBe(undefined);
    expect(map.apply(op("color", "green", 4, "B"))).toBe(true);
    expect(map.get("color")).toBe("green");
  });
});
