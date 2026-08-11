const products = [
  { id: 1, name: "Ноутбук" },
  { id: 2, name: "Телефон" },
];

const addInStock = (products) => {
  return products.map((product) => ({ ...product, inStock: true }));
};

// Пример вызова:
console.log(addInStock(products));
// [
//   { id: 1, name: "Ноутбук", inStock: true },
//   { id: 2, name: "Телефон", inStock: true }
// ]
