let callCount = 0;
const fetchSquare = (n) => {
  callCount++;
  return new Promise((resolve) => setTimeout(() => resolve(n * n), 100));
};

const memoizeAsync = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);

    const promise = fn(...args).catch((err) => {
      cache.delete(key);
      throw err;
    });

    cache.set(key, promise);
    return promise;
  };
};

const memoized = memoizeAsync(fetchSquare);
Promise.all([memoized(5), memoized(5), memoized(5)]).then((res) => {
  console.log(res, callCount); // [25, 25, 25] 1
});
