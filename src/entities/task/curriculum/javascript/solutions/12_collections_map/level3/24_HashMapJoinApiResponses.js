function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Пример использования:
function sum(a, b) {
  return a + b;
}

const memoizedSum = memoize(sum);

console.log(memoizedSum(1, 2)); // 3 (вычислено)
console.log(memoizedSum(1, 2)); // 3 (взято из кэша)
console.log(memoizedSum(2, 1)); // 3 (вычислено заново, порядок другой)
