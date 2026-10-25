// Управляемая отправка: каждый вызов send ждёт, пока тест его завершит.
const start = () => {
  const sends = [];
  const snapshots = [];
  let nextId = 0;
  const outbox = createMessageOutbox({
    send: (message) =>
      new Promise((resolve, reject) => {
        sends.push({ message, resolve, reject });
      }),
    onChange: (messages) => snapshots.push(messages),
    createId: () => `m${++nextId}`,
  });
  const last = () => snapshots[snapshots.length - 1];
  const flush = () => clock.tick(0);
  return { outbox, sends, snapshots, last, flush };
};

describe("оптимистичное добавление", () => {
  test("сообщение появляется сразу со статусом sending", () => {
    const { outbox, last } = start();
    outbox.post("привет");
    expect(last()).toEqual([{ id: "m1", text: "привет", status: "sending" }]);
  });

  test("onChange получает новый массив, прежний не меняется", () => {
    const { outbox, snapshots } = start();
    outbox.post("раз");
    const first = snapshots[snapshots.length - 1];
    outbox.post("два");
    const second = snapshots[snapshots.length - 1];
    expect(first === second).toBe(false);
    expect(first.length).toBe(1);
    expect(second.length).toBe(2);
  });

  test("успешная отправка переводит сообщение в sent", async () => {
    const { outbox, sends, last, flush } = start();
    outbox.post("привет");
    await flush();
    expect(sends[0].message).toEqual({ id: "m1", text: "привет" });
    sends[0].resolve();
    await flush();
    expect(last()[0].status).toBe("sent");
  });

  test("отказ переводит сообщение в failed, но оставляет его в списке", async () => {
    const { outbox, sends, last, flush } = start();
    outbox.post("привет");
    await flush();
    sends[0].reject(new Error("offline"));
    await flush();
    expect(last()).toEqual([{ id: "m1", text: "привет", status: "failed" }]);
  });
});

describe("очередь", () => {
  test("следующее сообщение уходит только после завершения предыдущего", async () => {
    const { outbox, sends, flush } = start();
    outbox.post("раз");
    outbox.post("два");
    await flush();
    expect(sends.length).toBe(1);
    sends[0].resolve();
    await flush();
    expect(sends.length).toBe(2);
    expect(sends[1].message.text).toBe("два");
  });

  test("ошибка первого сообщения не блокирует второе", async () => {
    const { outbox, sends, last, flush } = start();
    outbox.post("раз");
    outbox.post("два");
    await flush();
    sends[0].reject(new Error("offline"));
    await flush();
    sends[1].resolve();
    await flush();
    expect(last().map((message) => message.status)).toEqual(["failed", "sent"]);
  });
});

describe("повторная отправка", () => {
  test("retry возвращает failed в sending и отправляет заново", async () => {
    const { outbox, sends, last, flush } = start();
    outbox.post("привет");
    await flush();
    sends[0].reject(new Error("offline"));
    await flush();

    outbox.retry("m1");
    expect(last()[0].status).toBe("sending");
    await flush();
    expect(sends.length).toBe(2);
    expect(sends[1].message).toEqual({ id: "m1", text: "привет" });
    sends[1].resolve();
    await flush();
    expect(last()[0].status).toBe("sent");
  });

  test("retry не трогает сообщения, которые не в статусе failed", async () => {
    const { outbox, sends, snapshots, flush } = start();
    outbox.post("привет");
    await flush();
    const changesBefore = snapshots.length;
    outbox.retry("m1");
    outbox.retry("нет-такого");
    await flush();
    expect(sends.length).toBe(1);
    expect(snapshots.length).toBe(changesBefore);
  });

  test("повтор встаёт в конец очереди", async () => {
    const { outbox, sends, flush } = start();
    outbox.post("раз");
    await flush();
    sends[0].reject(new Error("offline"));
    await flush();
    outbox.post("два");
    outbox.retry("m1");
    await flush();
    sends[1].resolve();
    await flush();
    expect(sends.map((entry) => entry.message.text)).toEqual(["раз", "два", "раз"]);
  });
});
