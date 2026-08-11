// Композиция функций (pipe и compose)
// Напишите функции pipe(...fns) и compose(...fns).

const pipe = (...fns) => {
  // Решение тут
};

const compose = (...fns) => {
  // Решение тут
};

// Пример вызова:
const add2 = (x) => x + 2;
const mult3 = (x) => x * 3;

console.log(pipe(add2, mult3)(5));    // (5 + 2) * 3 = 21
console.log(compose(mult3, add2)(5)); // (5 + 2) * 3 = 21
