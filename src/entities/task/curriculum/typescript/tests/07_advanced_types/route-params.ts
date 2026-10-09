test("принимает ровно те параметры, что указаны в шаблоне", () => {
  buildUrl("/users/:userId/posts/:postId", { userId: "1", postId: "42" });
  buildUrl("/users/:userId", { userId: "1" });
  buildUrl("/about", {});
});

test("пропущенный параметр — ошибка", () => {
  // @ts-expect-error
  buildUrl("/users/:userId/posts/:postId", { userId: "1" });
  // @ts-expect-error
  buildUrl("/users/:userId", {});
});

test("лишний параметр или значение не строка — ошибка", () => {
  // @ts-expect-error
  buildUrl("/users/:userId", { userId: "1", extra: "x" });
  // @ts-expect-error
  buildUrl("/users/:userId", { userId: 1 });
});
