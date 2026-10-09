test("переменная method подходит для request", () => {
  request("/users", method);
});

test("поля options подходят для request", () => {
  request(options.url, options.method);
});

describe("Route", () => {
  test("Route — один из путей массива routes", () => {
    const home: Route = "/home";
    const about: Route = "/about";
  });

  test("неизвестный путь не является Route", () => {
    // @ts-expect-error
    const missing: Route = "/contacts";
  });
});
