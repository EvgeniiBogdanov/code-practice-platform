// Приватные метаданные через WeakMap
// Реализуйте систему отслеживания приватных метаданных (например, количества посещений trackVisit(user)),
// которая не препятствует сборке мусора при удалении объекта пользователя.

const visitCounts = new WeakMap();

const trackVisit = (user) => {
  // Решение тут
};

const getVisitCount = (user) => {
  // Решение тут
};

// Пример вызова:
const user = { name: "Alice" };
trackVisit(user);
trackVisit(user);
console.log(getVisitCount(user)); // 2
