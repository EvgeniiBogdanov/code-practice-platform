// Мемоизация с кастомным resolver-ом ключа
// Напишите функцию memoize(fn, resolver).

const memoize = (fn, resolver) => {
  // Решение тут
};

// Пример вызова:
let count = 0;
const add = (a, b) => {
  count++;
  return a + b;
};
const memoizedAdd = memoize(add, (a, b) => `${a}_${b}`);

console.log(memoizedAdd(2, 3)); // 5
console.log(memoizedAdd(2, 3)); // 5
console.log(count);             // 1
