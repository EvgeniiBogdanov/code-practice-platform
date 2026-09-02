// Слияние двух наборов данных по ID (Hash Join за O(N + M))

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
  const opts = options || {};
  const userKey = opts.userKey || "id";
  const orderKey = opts.orderKey || "userId";
  const outputField = opts.outputField || "orders";

  if (!Array.isArray(users)) return [];
  if (!Array.isArray(orders)) {
    return users.map((u) => (u && typeof u === "object" ? { ...u, [outputField]: [] } : u));
  }

  // 1. Построение хэш-таблицы (Build phase): O(M)
  const ordersMap = new Map();

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    if (order && typeof order === "object") {
      const foreignId = order[orderKey];
      if (foreignId !== undefined) {
        let group = ordersMap.get(foreignId);
        if (!group) {
          group = [];
          ordersMap.set(foreignId, group);
        }
        group.push(order);
      }
    }
  }

  // 2. Слияние с основной коллекцией (Probe phase): O(N)
  const result = new Array(users.length);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user && typeof user === "object") {
      const primaryId = user[userKey];
      const userOrders = (primaryId !== undefined ? ordersMap.get(primaryId) : null) || [];

      result[i] = {
        ...user,
        [outputField]: userOrders,
      };
    } else {
      result[i] = user;
    }
  }

  return result;
};

// Пример вызова:
const result = hashJoin(users, orders, {
  userKey: "id",
  orderKey: "userId",
  outputField: "orders",
});

console.log(result);
