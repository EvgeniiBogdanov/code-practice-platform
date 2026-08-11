const memoizeAsync = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const promise = fn(...args).catch((err) => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, promise);
    return promise;
  };
};

let callCount = 0;
const fetchSquare = (n) => {
  callCount++;
  return new Promise((resolve) => setTimeout(() => resolve(n * n), 100));
};

// Пример вызова:
const memoized = memoizeAsync(fetchSquare);
memoized(4).then(console.log); // 16
memoized(4).then(console.log); // 16
