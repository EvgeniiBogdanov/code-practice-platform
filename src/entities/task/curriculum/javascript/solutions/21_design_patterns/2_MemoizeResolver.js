const memoize = (fn, resolver) => {
  const cache = new Map();
  return (...args) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

let count = 0;
const add = (a, b) => {
  count++;
  return a + b;
};
const memoizedAdd = memoize(add, (a, b) => `${a}_${b}`);

// Пример вызова:
console.log(memoizedAdd(2, 3)); // 5
console.log(memoizedAdd(2, 3)); // 5
console.log(count);             // 1
