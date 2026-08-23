const products = [
  { name: "Apple", category: "Fruit" },
  { name: "Banana", category: "Fruit" },
  { name: "Carrot", category: "Vegetable" },
];

const groupProductsByCategory = (products) => {
  const grouped = Object.groupBy(products, (product) => product.category);
  return Object.fromEntries(
    Object.entries(grouped).map(([category, list]) => [
      category,
      list.map((item) => item.name),
    ])
  );
};

// Пример вызова:
console.log(groupProductsByCategory(products));
// {
//   Fruit: ["Apple", "Banana"],
//   Vegetable: ["Carrot"]
// }
