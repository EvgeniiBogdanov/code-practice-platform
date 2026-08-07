const products = [
  { name: "Хлеб", price: 50, quantity: 2 },
  { name: "Молоко", price: 80, quantity: 1 },
  { name: "Яйца", price: 120, quantity: 3 },
];

const totalPrice = (cart) => {
  return cart.reduce((acc, { price, quantity }) => acc + price * quantity, 0);
};

console.log(totalPrice(products)); // 540
