const start = () => {
  const results = [];
  const errors = [];
  const box = createDebouncedSearch(300, {
    onResults: (items) => results.push(items),
    onError: (error) => errors.push(error),
  });
  return { box, results, errors };
};

describe("пауза перед запросом", () => {
  test("запрос не уходит, пока не прошла пауза", async () => {
    const { box } = start();
    box.search("react");
    await clock.tick(299);
    expect(fetchMock.calls.length).toBe(0);
    await clock.tick(1);
    expect(fetchMock.calls.length).toBe(1);
  });

  test("серия нажатий даёт один запрос с последним текстом", async () => {
    const { box } = start();
    box.search("r");
    await clock.tick(100);
    box.search("re");
    await clock.tick(100);
    box.search("rea");
    await clock.tick(300);
    expect(fetchMock.calls.map((call) => call.url)).toEqual(["/api/search?q=rea"]);
  });

  test("запрос обрезается по краям и кодируется", async () => {
    const { box } = start();
    box.search("  c++ & d  ");
    await clock.tick(300);
    expect(fetchMock.calls[0].url).toBe("/api/search?q=c%2B%2B%20%26%20d");
  });

  test("пустой запрос очищает подсказки без обращения к серверу", async () => {
    const { box, results } = start();
    box.search("   ");
    expect(results).toEqual([[]]);
    await clock.runAll();
    expect(fetchMock.calls.length).toBe(0);
  });
});

describe("результаты и ошибки", () => {
  test("ответ сервера попадает в onResults", async () => {
    const { box, results } = start();
    box.search("re");
    await clock.tick(300);
    fetchMock.calls[0].resolve(["react", "redux"]);
    await clock.tick(0);
    expect(results).toEqual([["react", "redux"]]);
  });

  test("сетевая ошибка уходит в onError", async () => {
    const { box, results, errors } = start();
    box.search("re");
    await clock.tick(300);
    fetchMock.calls[0].reject(new Error("offline"));
    await clock.tick(0);
    expect(results).toEqual([]);
    expect(errors.length).toBe(1);
  });

  test("ответ не 2xx считается ошибкой", async () => {
    const { box, results, errors } = start();
    box.search("re");
    await clock.tick(300);
    fetchMock.calls[0].resolve([], { status: 500 });
    await clock.tick(0);
    expect(results).toEqual([]);
    expect(errors.length).toBe(1);
  });
});

describe("гонки", () => {
  test("новый запрос отменяет предыдущий, уже отправленный", async () => {
    const { box } = start();
    box.search("a");
    await clock.tick(300);
    box.search("ab");
    await clock.tick(300);
    expect(fetchMock.calls.length).toBe(2);
    expect(fetchMock.calls[0].aborted).toBe(true);
    expect(fetchMock.calls[1].aborted).toBe(false);
  });

  test("устаревший ответ не затирает свежий и отмена не считается ошибкой", async () => {
    const { box, results, errors } = start();
    box.search("a");
    await clock.tick(300);
    box.search("ab");
    await clock.tick(300);
    fetchMock.calls[1].resolve(["ab-result"]);
    await clock.tick(0);
    fetchMock.calls[0].resolve(["a-result"]);
    await clock.tick(0);
    expect(results).toEqual([["ab-result"]]);
    expect(errors).toEqual([]);
  });

  test("ответ, пришедший в момент нового ввода, игнорируется", async () => {
    const { box, results } = start();
    box.search("a");
    await clock.tick(300);
    // Ответ уже получен, но код решения ещё не успел его обработать: отмена опоздала.
    fetchMock.calls[0].resolve(["a-result"]);
    box.search("ab");
    await clock.tick(300);
    fetchMock.calls[1].resolve(["ab-result"]);
    await clock.tick(0);
    expect(results).toEqual([["ab-result"]]);
  });

  test("cancel снимает ожидающую паузу", async () => {
    const { box } = start();
    box.search("a");
    box.cancel();
    await clock.runAll();
    expect(fetchMock.calls.length).toBe(0);
  });

  test("cancel прерывает запрос в полёте и его ответ игнорируется", async () => {
    const { box, results, errors } = start();
    box.search("a");
    await clock.tick(300);
    box.cancel();
    expect(fetchMock.calls[0].aborted).toBe(true);
    await clock.tick(0);
    expect(results).toEqual([]);
    expect(errors).toEqual([]);
  });
});
