// Кэширование и Мемоизация (Memoize with Resolver)
// Реализуйте функцию memoize(fn, resolver), которая кэширует результаты вызова fn.
// Функция resolver(arg1, arg2...) определяет ключ кэша для аргументов.
// Если resolver не передан, по умолчанию ключом является первый аргумент (args[0]).

const memoize = (fn, resolver) => {
  // Ваш код здесь
};

const add = (a, b) => {
  console.log("Computing...");
  return a + b;
};

const memoizedAdd = memoize(add, (a, b) => `${a}_${b}`);

console.log(memoizedAdd(1, 2)); // Computing... 3
console.log(memoizedAdd(1, 2)); // 3 (из кэша)
console.log(memoizedAdd(2, 3)); // Computing... 5
