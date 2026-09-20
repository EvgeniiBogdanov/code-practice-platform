// Опишите тип для объекта, который хранит количество товаров на складе
// по их артикулу (строка), где значение — всегда число.

const stock = {
  "SKU-1": 10,
  "SKU-2": 5,
};

const addStock = (stock, sku, amount) => {
  stock[sku] = (stock[sku] ?? 0) + amount;
};
