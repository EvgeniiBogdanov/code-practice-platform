// Мемоизация функции со временем жизни кэша (TTL)
// Напишите функцию memoizeWithTTL(fn, ttlMs), кэширующую результат на ttlMs миллисекунд.

const memoizeWithTTL = (fn, ttlMs) => {
  // Решение тут
};

// Пример вызова:
const slowFn = memoizeWithTTL((x) => x * 2, 1000);
console.log(slowFn(5)); // 10
