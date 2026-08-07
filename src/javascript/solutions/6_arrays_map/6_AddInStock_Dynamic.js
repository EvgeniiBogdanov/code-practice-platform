// Вариант 2: Динамический передаваемый ключ и значение
const products = [
  { name: "Laptop", price: 1000 },
  { name: "Phone", price: 500 },
];

const addInStock = (arr, key, value) => {
  return arr.map((prod) => ({
    ...prod,
    [key]: value,
  }));
};

const result = addInStock(products, "inStock", true);
console.log(result);
