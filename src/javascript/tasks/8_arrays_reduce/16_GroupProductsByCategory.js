// Напишите функцию groupBy(arr, property), которая принимает массив объектов и строку с именем свойства.

const products = [
  { title: "Laptop", price: 999, category: "Electronics" },
  { title: "Coffee Mug", price: 15, category: "Kitchen" },
  { title: "Headphones", price: 150, category: "Electronics" },
  { title: "Blender", price: 45, category: "Kitchen" },
  { title: "Novel", price: 20, category: "Books" },
  { title: "Smartphone", price: 699, category: "Electronics" }
];

const groupBy = (arr, property) => {
  // Решение тут
};

const groupedProducts = groupBy(products, "category");
console.log(groupedProducts);
