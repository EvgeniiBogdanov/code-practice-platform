test("getUserName возвращает строку даже для неизвестного id", () => {
  const name: string = getUserName(999);
});

test("getCity принимает пользователя без адреса и возвращает строку", () => {
  const city: string = getCity({ id: 3, name: "Carol", nickname: null });
});

test("getDisplayName принимает пользователя без ника и возвращает строку", () => {
  const name: string = getDisplayName({ id: 3, name: "Carol", nickname: null });
});

test("модель пользователя по-прежнему требует nickname", () => {
  // @ts-expect-error
  getCity({ id: 3, name: "Carol" });
});
