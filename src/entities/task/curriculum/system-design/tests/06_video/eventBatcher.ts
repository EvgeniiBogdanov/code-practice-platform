// Управляемая отправка: каждый send ждёт, пока тест его завершит.
const start = (options = {}) => {
  const sends = [];
  const batcher = createEventBatcher({
    send: (batch) =>
      new Promise((resolve, reject) => {
        sends.push({ batch, resolve, reject });
      }),
    maxBatch: 3,
    flushMs: 1000,
    maxQueue: 100,
    ...options,
  });
  const batches = () => sends.map((call) => call.batch);
  const flushMicrotasks = () => clock.tick(0);
  return { batcher, sends, batches, flushMicrotasks };
};

describe("пачки", () => {
  test("пачка уходит, как только набралось maxBatch событий", async () => {
    const { batcher, batches, flushMicrotasks } = start();
    batcher.track("play");
    batcher.track("quality");
    await flushMicrotasks();
    expect(batches()).toEqual([]);
    batcher.track("pause");
    await flushMicrotasks();
    expect(batches()).toEqual([["play", "quality", "pause"]]);
  });

  test("неполная пачка уходит через flushMs после первого события", async () => {
    const { batcher, batches } = start();
    batcher.track("play");
    await clock.tick(500);
    batcher.track("pause");
    await clock.tick(499);
    expect(batches()).toEqual([]);
    await clock.tick(1);
    expect(batches()).toEqual([["play", "pause"]]);
  });

  test("после отправки отсчёт начинается заново со следующего события", async () => {
    const { batcher, sends, batches, flushMicrotasks } = start();
    batcher.track("a");
    batcher.track("b");
    batcher.track("c");
    sends[0].resolve();
    await flushMicrotasks();
    await clock.tick(600);
    batcher.track("d");
    await clock.tick(999);
    expect(batches().length).toBe(1);
    await clock.tick(1);
    expect(batches()).toEqual([["a", "b", "c"], ["d"]]);
  });
});

describe("одна отправка за раз", () => {
  test("события во время отправки ждут её конца", async () => {
    const { batcher, sends, batches, flushMicrotasks } = start();
    ["a", "b", "c", "d", "e", "f"].forEach((event) => batcher.track(event));
    await flushMicrotasks();
    expect(batches()).toEqual([["a", "b", "c"]]);
    sends[0].resolve();
    await flushMicrotasks();
    expect(batches()).toEqual([
      ["a", "b", "c"],
      ["d", "e", "f"],
    ]);
  });

  test("отклонённая пачка возвращается в начало очереди", async () => {
    const { batcher, sends, batches, flushMicrotasks } = start();
    ["a", "b", "c", "d"].forEach((event) => batcher.track(event));
    sends[0].reject(new Error("offline"));
    await flushMicrotasks();
    await clock.tick(1000);
    expect(batches()[1]).toEqual(["a", "b", "c"]);
    sends[1].resolve();
    await flushMicrotasks();
    expect(batches()[2]).toEqual(["d"]);
  });
});

describe("flush и переполнение", () => {
  test("flush отправляет всё сразу и ждёт отправки", async () => {
    const { batcher, sends, batches, flushMicrotasks } = start();
    ["a", "b", "c", "d"].forEach((event) => batcher.track(event));
    let done = false;
    batcher.flush().then(() => {
      done = true;
    });
    sends[0].resolve();
    await flushMicrotasks();
    expect(batches()).toEqual([["a", "b", "c"], ["d"]]);
    expect(done).toBe(false);
    sends[1].resolve();
    await flushMicrotasks();
    expect(done).toBe(true);
  });

  test("flush без событий ничего не отправляет", async () => {
    const { batcher, batches } = start();
    await batcher.flush();
    expect(batches()).toEqual([]);
  });

  test("сверх maxQueue выбрасываются самые старые события", async () => {
    const { batcher, batches, flushMicrotasks } = start({ maxBatch: 10, maxQueue: 3 });
    [1, 2, 3, 4, 5].forEach((event) => batcher.track(event));
    batcher.flush();
    await flushMicrotasks();
    expect(batches()).toEqual([[3, 4, 5]]);
  });
});
