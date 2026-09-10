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
    cache.set(key, {
      value: result,
      expiry: now + ms,
    });
    return result;
  };
};

let callCount = 0;
const slowSquare = (x) => {
  callCount++;
  return x * x;
};

const memoSquare = memoize(slowSquare, 1000);

console.log(memoSquare(5)); // 25, callCount = 1
console.log(memoSquare(5)); // 25, callCount = 1 (взято из кэша)
console.log(callCount);     // 1

setTimeout(() => {
  console.log(memoSquare(5)); // 25, callCount = 2 (кэш устарел)
  console.log(callCount);     // 2
}, 1500);
