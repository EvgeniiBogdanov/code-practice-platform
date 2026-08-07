// Композиция функций: Pipe и Compose
// Реализуйте две функции:
// 1. pipe(...fns) — принимает набор функций и возвращает новую функцию, применяющую их слева направо.
// 2. compose(...fns) — принимает набор функций и возвращает новую функцию, применяющую их справа налево.

function pipe(...fns) {
  // Ваш код здесь
}

function compose(...fns) {
  // Ваш код здесь
}

// Пример использования:
const add2 = (x) => x + 2;
const multiply3 = (x) => x * 3;
const square = (x) => x ** 2;

const piped = pipe(add2, multiply3, square);
console.log(piped(2)); // ((2 + 2) * 3)^2 = (4 * 3)^2 = 12^2 = 144

const composed = compose(square, multiply3, add2);
console.log(composed(2)); // square(multiply3(add2(2))) = 144
