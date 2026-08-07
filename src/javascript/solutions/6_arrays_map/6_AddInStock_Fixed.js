// Вариант 1: С фиксированным полем inStock: true
const products = [
  { name: "Laptop", price: 1000 },
  { name: "Phone", price: 500 },
];

const addInStock = (arr) => arr.map((product) => ({ ...product, inStock: true }));

const result = addInStock(products);
console.log(result);
