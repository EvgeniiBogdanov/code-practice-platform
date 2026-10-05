// Универсальное каррирование curry(fn)
// Напишите функцию curry(fn), которая превращает функцию от N аргументов в каррированную.
// Каррированная функция принимает аргументы по одному или группами и вызывает fn,
// когда накоплено fn.length аргументов.

const curry = (fn) => {
  // Решение тут
};

// Пример вызова:
const sum3 = (a, b, c) => a + b + c;
const curriedSum = curry(sum3);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1)(2, 3)); // 6
console.log(curriedSum(1, 2, 3)); // 6

const addOne = curriedSum(1);
console.log(addOne(10)(100)); // 111
console.log(addOne(20, 200)); // 221 — частично применённая функция переиспользуется

const greet = (greeting, name) => `${greeting}, ${name}!`;
console.log(curry(greet)("Привет")("Анна")); // "Привет, Анна!"
