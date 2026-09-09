const products = [
  { name: "Яблоко", category: "Фрукты" },
  { name: "Морковь", category: "Овощи" },
  { name: "Банан", category: "Фрукты" },
  { name: "Огурец", category: "Овощи" },
  { name: "Груша", category: "Фрукты" },
];

const groupProductsByCategory = (products) => {
  return products.reduce((acc, product) => {
    acc[product.category] ??= [];
    acc[product.category].push(product.name);
    return acc;
  }, {});
};

// Пример вызова:
console.log(groupProductsByCategory(products));
// {
//   "Фрукты": ["Яблоко", "Банан", "Груша"],
//   "Овощи": ["Морковь", "Огурец"]
// }
