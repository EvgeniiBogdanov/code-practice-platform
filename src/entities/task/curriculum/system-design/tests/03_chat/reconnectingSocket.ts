// random: () => 1 даёт максимальную задержку, поэтому расписание предсказуемо.
const start = (options = {}) => {
  const messages = [];
  const statuses = [];
  const socket = createReconnectingSocket(
    "wss://chat.test/ws",
    { onMessage: (data) => messages.push(data), onStatusChange: (status) => statuses.push(status) },
    { random: () => 1, ...options }
  );
  return { socket, messages, statuses };
};

describe("подключение", () => {
  test("сразу открывает соединение по адресу", () => {
    const { statuses } = start();
    expect(wsMock.instances.length).toBe(1);
    expect(wsMock.instances[0].url).toBe("wss://chat.test/ws");
    expect(statuses).toEqual(["connecting"]);
  });

  test("сообщения сервера доходят до onMessage", () => {
    const { messages } = start();
    wsMock.instances[0].simulateOpen();
    wsMock.instances[0].simulateMessage("привет");
    expect(messages).toEqual(["привет"]);
  });
});

describe("переподключение", () => {
  test("задержка растёт экспоненциально: 1с, 2с, 4с", async () => {
    start();
    wsMock.instances[0].simulateClose();
    await clock.tick(999);
    expect(wsMock.instances.length).toBe(1);
    await clock.tick(1);
    expect(wsMock.instances.length).toBe(2);

    wsMock.instances[1].simulateClose();
    await clock.tick(1999);
    expect(wsMock.instances.length).toBe(2);
    await clock.tick(1);
    expect(wsMock.instances.length).toBe(3);

    wsMock.instances[2].simulateClose();
    await clock.tick(3999);
    expect(wsMock.instances.length).toBe(3);
    await clock.tick(1);
    expect(wsMock.instances.length).toBe(4);
  });

  test("задержка не превышает maxDelayMs", async () => {
    start({ maxDelayMs: 3000 });
    for (let i = 0; i < 4; i++) {
      wsMock.instances[i].simulateClose();
      await clock.tick(3000);
    }
    expect(wsMock.instances.length).toBe(5);
  });

  test("джиттер уменьшает задержку: random() умножается на потолок", async () => {
    start({ random: () => 0.5 });
    wsMock.instances[0].simulateClose();
    await clock.tick(499);
    expect(wsMock.instances.length).toBe(1);
    await clock.tick(1);
    expect(wsMock.instances.length).toBe(2);
  });

  test("после успешного открытия отсчёт начинается заново", async () => {
    start();
    wsMock.instances[0].simulateClose();
    await clock.tick(1000);
    wsMock.instances[1].simulateClose();
    await clock.tick(2000);
    wsMock.instances[2].simulateOpen();
    wsMock.instances[2].simulateClose();
    await clock.tick(1000);
    expect(wsMock.instances.length).toBe(4);
  });

  test("статусы меняются в порядке жизненного цикла", async () => {
    const { socket, statuses } = start();
    wsMock.instances[0].simulateOpen();
    wsMock.instances[0].simulateClose();
    await clock.tick(1000);
    wsMock.instances[1].simulateOpen();
    socket.close();
    expect(statuses).toEqual(["connecting", "open", "reconnecting", "open", "closed"]);
  });
});

describe("отправка", () => {
  test("сообщения до открытия уходят после него, по порядку", () => {
    const { socket } = start();
    socket.send("раз");
    socket.send("два");
    expect(wsMock.instances[0].sent).toEqual([]);
    wsMock.instances[0].simulateOpen();
    expect(wsMock.instances[0].sent).toEqual(["раз", "два"]);
  });

  test("на открытом соединении сообщение уходит сразу", () => {
    const { socket } = start();
    wsMock.instances[0].simulateOpen();
    socket.send("привет");
    expect(wsMock.instances[0].sent).toEqual(["привет"]);
  });

  test("сообщение, отправленное при обрыве, уходит в новое соединение", async () => {
    const { socket } = start();
    wsMock.instances[0].simulateOpen();
    wsMock.instances[0].simulateClose();
    socket.send("потеряшка");
    await clock.tick(1000);
    wsMock.instances[1].simulateOpen();
    expect(wsMock.instances[1].sent).toEqual(["потеряшка"]);
  });
});

describe("закрытие", () => {
  test("после close переподключения нет", async () => {
    const { socket } = start();
    wsMock.instances[0].simulateOpen();
    socket.close();
    await clock.runAll();
    expect(wsMock.instances.length).toBe(1);
  });

  test("close во время ожидания отменяет запланированное подключение", async () => {
    const { socket } = start();
    wsMock.instances[0].simulateClose();
    socket.close();
    await clock.runAll();
    expect(wsMock.instances.length).toBe(1);
  });
});
