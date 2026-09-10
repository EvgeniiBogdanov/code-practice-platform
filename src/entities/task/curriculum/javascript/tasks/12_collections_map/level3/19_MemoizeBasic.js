// Базовая мемоизация вычислений
// Напишите функцию memoize(fn), кэширующую результаты вызовов по переданным аргументам.

const memoize = (fn) => {
  // Решение тут
};

// Пример вызова:
const add = (a, b) => {
  console.log("Вычисляю...");
  return a + b;
};

const memoizedAdd = memoize(add);
console.log(memoizedAdd(2, 3)); // Выведет "Вычисляю..." и 5
console.log(memoizedAdd(2, 3)); // Вернет 5 из кэша (без "Вычисляю...")

