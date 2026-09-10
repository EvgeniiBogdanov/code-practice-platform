// Мемоизация с ограничением времени жизни кэша (TTL)
// Реализуйте функцию memoize(fn, ms), кэширующую результат вызова fn на ms миллисекунд.

const memoize = (fn, ms) => {
  // Решение тут
};

// Пример вызова:
const slowFn = memoize((x) => x * 2, 1000);
console.log(slowFn(5)); // 10
console.log(slowFn(5)); // 10 (из кэша)

