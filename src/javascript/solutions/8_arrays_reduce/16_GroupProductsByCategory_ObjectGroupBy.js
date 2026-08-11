const products = [
  { title: "Laptop", price: 999, category: "Electronics" },
  { title: "Coffee Mug", price: 15, category: "Kitchen" },
  { title: "Headphones", price: 150, category: "Electronics" },
  { title: "Blender", price: 45, category: "Kitchen" },
  { title: "Novel", price: 20, category: "Books" },
  { title: "Smartphone", price: 699, category: "Electronics" }
];

const groupByNative = (arr, property) =>
  Object.groupBy(arr, (obj) => obj[property]);

// Пример вызова:
console.log(groupByNative(products, "category"));
