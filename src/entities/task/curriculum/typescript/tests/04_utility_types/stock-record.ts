test("Stock хранит числа по строковым артикулам", () => {
  const storage: Stock = { "SKU-1": 10, "SKU-2": 5 };
  const amount: number = storage["SKU-3"];
});

test("значения Stock — только числа", () => {
  // @ts-expect-error
  const wrong: Stock = { "SKU-1": "10" };
});

test("addStock принимает склад, артикул и количество", () => {
  addStock(stock, "SKU-3", 7);
  // @ts-expect-error
  addStock(stock, "SKU-3", "7");
  // @ts-expect-error
  addStock({ "SKU-1": "10" }, "SKU-1", 1);
});
