test("changeStatus принимает значение из объекта OrderStatus", () => {
  changeStatus(OrderStatus.Pending);
});

test("changeStatus принимает строковый литерал из API", () => {
  changeStatus("shipped");
});

test("changeStatus отклоняет неизвестный статус", () => {
  // @ts-expect-error
  changeStatus("lost");
});

test("OrderStatus одновременно тип и объект со статусами", () => {
  const delivered: OrderStatus = OrderStatus.Delivered;
  const cancelled: OrderStatus = "cancelled";
  // @ts-expect-error
  const lost: OrderStatus = "lost";
});

test("statusOptions — массив статусов, а не произвольных строк", () => {
  const first: OrderStatus = statusOptions[0];
  // @ts-expect-error
  statusOptions.push("lost");
});
