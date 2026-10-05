const orders = [
  { id: 1, total: 500, paid: true, status: "delivered" },
  { id: 2, total: 1500, paid: false, status: "shipping" },
  { id: 3, total: 300, paid: true, status: "delivered" },
  { id: 4, total: 2500, paid: true, status: "delivered" },
];

// some — «хотя бы один»: останавливается на первом true
const hasUnpaid = (orders) => orders.some((order) => !order.paid);

// every — «все»: останавливается на первом false
const allDelivered = (orders) => orders.every((order) => order.status === "delivered");

// findIndex — индекс первого подходящего элемента или -1
const firstExpensiveIndex = (orders, limit) => orders.findIndex((order) => order.total > limit);

// findLastIndex (ES2023) — поиск с конца массива
const lastPaidIndex = (orders) => orders.findLastIndex((order) => order.paid);

// Пример вызова:
console.log(hasUnpaid(orders)); // true
console.log(allDelivered(orders)); // false
console.log(firstExpensiveIndex(orders, 1000)); // 1
console.log(firstExpensiveIndex(orders, 5000)); // -1
console.log(lastPaidIndex(orders)); // 3
console.log(hasUnpaid([])); // false — в пустом массиве нет ни одного подходящего
console.log(allDelivered([])); // true — «все» элементы пустого массива подходят (vacuous truth)
