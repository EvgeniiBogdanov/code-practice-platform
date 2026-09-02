// Базовая мемоизация вычислений
// Напишите функцию memoize(fn), кэширующую результаты вызовов по переданным аргументам.

const memoize = (fn) => {
  // Решение тут
};

// Пример вызова:
const sum = (a, b) => a + b;
const memoizedSum = memoize(sum);
console.log(memoizedSum(1, 2)); // 3
console.log(memoizedSum(1, 2)); // 3
