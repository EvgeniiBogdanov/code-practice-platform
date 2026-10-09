test("идентификатор подходит своей функции", () => {
  getUserById(userId);
  getOrderById(orderId);
});

test("идентификатор заказа нельзя передать как идентификатор пользователя", () => {
  // @ts-expect-error
  getUserById(orderId);
});

test("идентификатор пользователя нельзя передать как идентификатор заказа", () => {
  // @ts-expect-error
  getOrderById(userId);
});

test("обычная строка не является идентификатором", () => {
  // @ts-expect-error
  getUserById("user-1");
  // @ts-expect-error
  getOrderById("order-1");
});
