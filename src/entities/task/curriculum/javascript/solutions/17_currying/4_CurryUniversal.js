const curry = (fn) => {
  const curried = (...args) =>
    // Хватает аргументов — вызываем исходную функцию
    args.length >= fn.length
      ? fn(...args)
      : // Не хватает — возвращаем функцию, которая запомнит уже собранные args (замыкание)
        (...nextArgs) => curried(...args, ...nextArgs);

  return curried;
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
console.log(addOne(20, 200)); // 221

const greet = (greeting, name) => `${greeting}, ${name}!`;
console.log(curry(greet)("Привет")("Анна")); // "Привет, Анна!"
