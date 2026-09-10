// Композиция функций: pipe и compose
// Реализуйте функции pipe(...fns) и compose(...fns).
// - pipe выполняет функции слева направо: pipe(f, g)(x) === g(f(x))
// - compose выполняет функции справа налево: compose(f, g)(x) === f(g(x))

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

