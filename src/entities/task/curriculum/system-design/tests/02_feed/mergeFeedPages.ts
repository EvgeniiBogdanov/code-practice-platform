const post = (id, likes = 0) => ({ id, likes });

describe("слияние страниц", () => {
  test("склеивает страницы по порядку", () => {
    const merged = mergeFeedPages([
      { items: [post("1"), post("2")], nextCursor: "c2" },
      { items: [post("3")], nextCursor: "c3" },
    ]);
    expect(merged.items.map((item) => item.id)).toEqual(["1", "2", "3"]);
  });

  test("берёт nextCursor последней страницы", () => {
    const merged = mergeFeedPages([
      { items: [post("1")], nextCursor: "c2" },
      { items: [post("2")], nextCursor: null },
    ]);
    expect(merged.nextCursor).toBe(null);
  });

  test("без страниц возвращает пустую ленту", () => {
    expect(mergeFeedPages([])).toEqual({ items: [], nextCursor: null });
  });
});

describe("дубликаты", () => {
  test("пост остаётся на месте первого появления", () => {
    const merged = mergeFeedPages([
      { items: [post("1"), post("2")], nextCursor: "c2" },
      { items: [post("2"), post("3")], nextCursor: "c3" },
    ]);
    expect(merged.items.map((item) => item.id)).toEqual(["1", "2", "3"]);
  });

  test("данные берутся из последней версии поста", () => {
    const merged = mergeFeedPages([
      { items: [post("1", 1), post("2", 5)], nextCursor: "c2" },
      { items: [post("2", 9)], nextCursor: null },
    ]);
    expect(merged.items).toEqual([post("1", 1), post("2", 9)]);
  });

  test("дубль внутри одной страницы тоже схлопывается", () => {
    const merged = mergeFeedPages([{ items: [post("1", 1), post("1", 2)], nextCursor: null }]);
    expect(merged.items).toEqual([post("1", 2)]);
  });
});

describe("неизменяемость", () => {
  test("входные страницы не меняются", () => {
    const first = { items: [post("1", 1)], nextCursor: "c2" };
    const second = { items: [post("1", 2), post("2")], nextCursor: null };
    mergeFeedPages([first, second]);
    expect(first).toEqual({ items: [post("1", 1)], nextCursor: "c2" });
    expect(second).toEqual({ items: [post("1", 2), post("2")], nextCursor: null });
  });
});
