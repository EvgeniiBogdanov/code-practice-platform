const cart = [
  { name: "Laptop", price: 1000 },
  { name: "Phone", price: 500 },
  { name: "Tablet", price: 800 },
];

const totalCartPrice = (cart) => {
  return cart.reduce((acc, prod) => acc + prod.price, 0);
};

// Пример вызова:
console.log(totalCartPrice(cart)); // 2300
