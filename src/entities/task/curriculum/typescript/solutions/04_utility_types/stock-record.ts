type Stock = Record<string, number>;

const stock: Stock = {
  "SKU-1": 10,
  "SKU-2": 5,
};

const addStock = (stock: Stock, sku: string, amount: number): void => {
  stock[sku] = (stock[sku] ?? 0) + amount;
};
