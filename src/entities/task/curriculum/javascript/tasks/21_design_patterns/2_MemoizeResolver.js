// Мемоизация с кастомным resolver-ом ключа
// Напишите функцию memoize(fn, resolver), которая кэширует результаты вызова fn. Ключ кэша формируется функцией resolver(...args) (по умолчанию первый аргумент).

const memoize = (fn, resolver) => {
  // Решение тут
};

// Пример вызова:
const sum = (a, b) => a + b;
const memoizedSum = memoize(sum, (a, b) => `${a}_${b}`);
console.log(memoizedSum(2, 3)); // 5
console.log(memoizedSum(2, 3)); // 5 (из кэша)
