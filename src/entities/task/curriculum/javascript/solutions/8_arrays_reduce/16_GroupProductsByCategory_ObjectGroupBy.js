const products = [
  { name: "Яблоко", category: "Фрукты" },
  { name: "Морковь", category: "Овощи" },
  { name: "Банан", category: "Фрукты" },
  { name: "Огурец", category: "Овощи" },
  { name: "Груша", category: "Фрукты" },
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
//   "Фрукты": ["Яблоко", "Банан", "Груша"],
//   "Овощи": ["Морковь", "Огурец"]
// }
