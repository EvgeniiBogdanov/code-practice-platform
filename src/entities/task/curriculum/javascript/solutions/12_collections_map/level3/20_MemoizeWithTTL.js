const memoize = (fn, ms) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache.has(key)) {
      const { value, expiry } = cache.get(key);
      if (now < expiry) {
        return value;
      }
    }

    const result = fn(...args);
    cache.set(key, { value: result, expiry: now + ms });
    return result;
  };
};

// Пример вызова:
const slowFn = memoize((x) => x * 2, 1000);
console.log(slowFn(5)); // 10
console.log(slowFn(5)); // 10 (из кэша)

