const products = [
  { title: "Laptop", price: 999, category: "Electronics" },
  { title: "Coffee Mug", price: 15, category: "Kitchen" },
  { title: "Headphones", price: 150, category: "Electronics" },
  { title: "Blender", price: 45, category: "Kitchen" },
  { title: "Novel", price: 20, category: "Books" },
  { title: "Smartphone", price: 699, category: "Electronics" }
];

const groupBy = (arr, property) => arr.reduce((acc, obj) => {
  const key = obj[property];
  if (!acc[key]) acc[key] = [];
  acc[key].push(obj);
  return acc;
}, {});

console.log(groupBy(products, "category"));
