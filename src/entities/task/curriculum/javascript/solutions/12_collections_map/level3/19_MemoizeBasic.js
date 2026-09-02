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

// Пример вызова:
const add = (a, b) => {
  console.log("Вычисляю...");
  return a + b;
};

const memoizedAdd = memoize(add);
console.log(memoizedAdd(2, 3)); // Выведет "Вычисляю..." и 5
console.log(memoizedAdd(2, 3)); // Вернет 5 из кэша (без "Вычисляю...")
