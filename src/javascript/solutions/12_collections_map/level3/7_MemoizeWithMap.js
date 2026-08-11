const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

let calls = 0;
const square = (n) => {
  calls++;
  return n * n;
};
const memoizedSquare = memoize(square);

// Пример вызова:
console.log(memoizedSquare(4)); // 16
console.log(memoizedSquare(4)); // 16
console.log(calls);             // 1
