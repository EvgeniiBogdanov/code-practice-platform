const products = [
  { name: "Apple", category: "Fruit" },
  { name: "Banana", category: "Fruit" },
  { name: "Carrot", category: "Vegetable" },
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
//   Fruit: ["Apple", "Banana"],
//   Vegetable: ["Carrot"]
// }
