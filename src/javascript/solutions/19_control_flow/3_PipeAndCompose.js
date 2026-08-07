function pipe(...fns) {
  return function (initialValue) {
    return fns.reduce((acc, fn) => fn(acc), initialValue);
  };
}

function compose(...fns) {
  return function (initialValue) {
    return fns.reduceRight((acc, fn) => fn(acc), initialValue);
  };
}

// Пример использования:
const add2 = (x) => x + 2;
const multiply3 = (x) => x * 3;
const square = (x) => x ** 2;

const piped = pipe(add2, multiply3, square);
console.log(piped(2)); // ((2 + 2) * 3)^2 = (4 * 3)^2 = 12^2 = 144

const composed = compose(square, multiply3, add2);
console.log(composed(2)); // square(multiply3(add2(2))) = 144
