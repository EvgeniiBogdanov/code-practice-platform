// Методы some, every, findIndex и findLastIndex
// Используя только эти методы, реализуйте функции:
// 1. hasUnpaid(orders) — есть ли хотя бы один неоплаченный заказ (paid === false)
// 2. allDelivered(orders) — все ли заказы доставлены (status === "delivered")
// 3. firstExpensiveIndex(orders, limit) — индекс первого заказа дороже limit или -1
// 4. lastPaidIndex(orders) — индекс последнего оплаченного заказа или -1

const orders = [
  { id: 1, total: 500, paid: true, status: "delivered" },
  { id: 2, total: 1500, paid: false, status: "shipping" },
  { id: 3, total: 300, paid: true, status: "delivered" },
  { id: 4, total: 2500, paid: true, status: "delivered" },
];

const hasUnpaid = (orders) => {
  // Решение тут
};

const allDelivered = (orders) => {
  // Решение тут
};

const firstExpensiveIndex = (orders, limit) => {
  // Решение тут
};

const lastPaidIndex = (orders) => {
  // Решение тут
};

// Пример вызова:
console.log(hasUnpaid(orders)); // true
console.log(allDelivered(orders)); // false
console.log(firstExpensiveIndex(orders, 1000)); // 1
console.log(firstExpensiveIndex(orders, 5000)); // -1
console.log(lastPaidIndex(orders)); // 3
console.log(hasUnpaid([])); // false
console.log(allDelivered([])); // true
