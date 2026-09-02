// Композиция функций: pipe и compose
// Реализуйте функции pipe(...fns) и compose(...fns).
// - pipe выполняет функции слева направо: f(g(h(x)))
// - compose выполняет функции справа налево: f(g(h(x)))

const pipe = (...fns) => {
  // Решение тут
};

const compose = (...fns) => {
  // Решение тут
};

// Пример вызова:
const add5 = (x) => x + 5;
const mult2 = (x) => x * 2;

const p = pipe(add5, mult2);
console.log(p(10)); // (10 + 5) * 2 = 30

const c = compose(add5, mult2);
console.log(c(10)); // (10 * 2) + 5 = 25
