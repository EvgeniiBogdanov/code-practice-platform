describe("вызов сразу и в конце окна", () => {
  test("первый вызов выполняется сразу", () => {
    const calls: number[] = [];
    const throttled = createThrottle((n: number) => calls.push(n), 100);
    throttled.call(1);
    expect(calls).toEqual([1]);
  });

  test("вызовы внутри окна схлопываются в один завершающий с последними аргументами", async () => {
    const calls: number[] = [];
    const throttled = createThrottle((n: number) => calls.push(n), 100);
    throttled.call(1);
    throttled.call(2);
    throttled.call(3);
    expect(calls).toEqual([1]);
    await clock.tick(100);
    expect(calls).toEqual([1, 3]);
  });

  test("без вызовов внутри окна завершающий вызов не срабатывает", async () => {
    const calls: number[] = [];
    const throttled = createThrottle((n: number) => calls.push(n), 100);
    throttled.call(1);
    await clock.tick(100);
    expect(calls).toEqual([1]);
  });

  test("после тихого окна следующий вызов снова выполняется сразу", async () => {
    const calls: number[] = [];
    const throttled = createThrottle((n: number) => calls.push(n), 100);
    throttled.call(1);
    await clock.tick(100);
    throttled.call(2);
    expect(calls).toEqual([1, 2]);
  });

  test("вызовы каждые 50 мс дают выполнение каждые 100 мс", async () => {
    const calls: number[] = [];
    const throttled = createThrottle((n: number) => calls.push(n), 100);
    throttled.call(1);
    throttled.call(2);
    await clock.tick(50);
    throttled.call(3);
    await clock.tick(50);
    expect(calls).toEqual([1, 3]);
    throttled.call(4);
    await clock.tick(100);
    expect(calls).toEqual([1, 3, 4]);
  });
});

describe("отмена", () => {
  test("cancel отменяет ожидающий завершающий вызов", async () => {
    const calls: number[] = [];
    const throttled = createThrottle((n: number) => calls.push(n), 100);
    throttled.call(1);
    throttled.call(2);
    throttled.cancel();
    await clock.tick(100);
    expect(calls).toEqual([1]);
  });

  test("после cancel следующий вызов снова выполняется сразу", () => {
    const calls: number[] = [];
    const throttled = createThrottle((n: number) => calls.push(n), 100);
    throttled.call(1);
    throttled.cancel();
    throttled.call(2);
    expect(calls).toEqual([1, 2]);
  });
});
