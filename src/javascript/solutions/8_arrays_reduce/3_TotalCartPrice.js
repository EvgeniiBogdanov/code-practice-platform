const cart = [
  { name: "Laptop", price: 1000 },
  { name: "Phone", price: 500 },
  { name: "Tablet", price: 800 },
];

const sum = (arr) => {
  return arr.reduce((acc, prod) => acc + prod.price, 0);
};

console.log(sum(cart)); // 2300
