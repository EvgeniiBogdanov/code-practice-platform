// Кэширование и Мемоизация (Memoize with Resolver)

const memoize = (fn, resolver) => {
  const cache = new Map();

  return function (...args) {
    const key = resolver ? resolver(...args) : args[0];

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

const add = (a, b) => {
  console.log("Computing...");
  return a + b;
};

const memoizedAdd = memoize(add, (a, b) => `${a}_${b}`);

console.log(memoizedAdd(1, 2)); // Computing... 3
console.log(memoizedAdd(1, 2)); // 3 (из кэша)
console.log(memoizedAdd(2, 3)); // Computing... 5
