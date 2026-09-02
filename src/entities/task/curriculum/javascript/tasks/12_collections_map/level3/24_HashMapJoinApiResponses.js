// Слияние двух наборов данных по ключу (Hash Join за O(N + M))
// Реализуйте функцию hashJoin(users, orders, options), которая объединяет два массива объектов по связующему ключу за линейное время O(N + M).
//
// Параметры options:
// - userKey: поле в объекте пользователя (по умолчанию "id")
// - orderKey: поле связи в объекте заказа (по умолчанию "userId")
// - outputField: имя результирующего поля с массивом связанных заказов (по умолчанию "orders")
//
// Требования:
// 1. Исходные массивы и объекты не должны мутироваться.
// 2. Если у пользователя нет связанных заказов, в outputField должен быть пустой массив [].

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const orders = [
  { orderId: 101, userId: 1, amount: 250 },
  { orderId: 102, userId: 2, amount: 400 },
  { orderId: 103, userId: 1, amount: 150 },
];

const hashJoin = (users, orders, options = {}) => {
  // Решение тут
};

// Пример вызова:
const result = hashJoin(users, orders, {
  userKey: "id",
  orderKey: "userId",
  outputField: "orders",
});

console.log(result);
// [
//   { id: 1, name: "Alice", orders: [ { orderId: 101, ... }, { orderId: 103, ... } ] },
//   { id: 2, name: "Bob", orders: [ { orderId: 102, ... } ] },
//   { id: 3, name: "Charlie", orders: [] }
// ]
