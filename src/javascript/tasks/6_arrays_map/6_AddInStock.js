// Добавить новое поле в каждый объект
// Добавить поле "inStock: true"
// Ожидаемый результат:
// [
//   { name: "Laptop", price: 1000, inStock: true },
//   { name: "Phone", price: 500, inStock: true }
// ]
const products = [
  { name: "Laptop", price: 1000 },
  { name: "Phone", price: 500 }
];

// Тут код:
const addInStock = () => {};

// Проверка
const result = addInStock(products, "inStock", true);
console.log(result);
