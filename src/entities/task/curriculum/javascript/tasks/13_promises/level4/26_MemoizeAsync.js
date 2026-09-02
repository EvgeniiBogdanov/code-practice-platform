// Асинхронная мемоизация промисов
// Напишите функцию memoizeAsync(fn), кэширующую результаты асинхронных вызовов по переданным аргументам.

const memoizeAsync = (fn) => {
  // Решение тут
};

// Пример вызова:
let callCount = 0;
const fetchSquare = (n) => {
  callCount++;
  return new Promise((resolve) => setTimeout(() => resolve(n * n), 100));
};

const memoized = memoizeAsync(fetchSquare);
memoized(4).then(console.log); // 16
memoized(4).then(console.log); // 16
