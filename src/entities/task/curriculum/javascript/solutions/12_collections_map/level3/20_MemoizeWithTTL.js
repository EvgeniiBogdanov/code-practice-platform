const memoizeWithTTL = (fn, ttl) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache.has(key)) {
      const entry = cache.get(key);
      if (now - entry.timestamp < ttl) {
        return entry.value;
      }
      cache.delete(key);
    }

    const value = fn(...args);
    cache.set(key, { value, timestamp: now });
    return value;
  };
};

// Пример вызова:
const memoized = memoizeWithTTL((x) => x * 2, 1000);
console.log(memoized(5)); // 10
