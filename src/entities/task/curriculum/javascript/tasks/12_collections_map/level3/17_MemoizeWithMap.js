// Мемоизация функции
// Напишите функцию memoize(fn), которая кэширует результаты вызовов функции по переданным аргументам.

const memoize = (fn) => {
  // Решение тут
};

// Пример вызова:
const slowSquare = memoize((n) => n * n);
console.log(slowSquare(4)); // 16
console.log(slowSquare(4)); // 16 (из кэша)
