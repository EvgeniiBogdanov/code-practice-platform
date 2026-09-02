// Мемоизация с TTL и логированием статуса
// Напишите функцию memoize(fn, ttl), логирующую статус ("from cache", "calculated").

const memoize = (fn, ttl) => {
  // Решение тут
};

// Пример вызова:
const getData = memoize((id) => id + 10, 2000);
console.log(getData(1)); // calculated -> 11
console.log(getData(1)); // from cache -> 11
