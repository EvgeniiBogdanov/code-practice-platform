// Мемоизация функции с помощью Map
// Напишите функцию memoize(fn), которая кэширует результаты вызовов по аргументам.

const memoize = (fn) => {
  // Решение тут
};

// Пример вызова:
let calls = 0;
const square = (n) => {
  calls++;
  return n * n;
};
const memoizedSquare = memoize(square);

console.log(memoizedSquare(4)); // 16
console.log(memoizedSquare(4)); // 16
console.log(calls);             // 1
