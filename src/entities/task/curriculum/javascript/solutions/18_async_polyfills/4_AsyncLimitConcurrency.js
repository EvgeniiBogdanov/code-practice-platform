const asyncPool = async (limit, items, iteratorFn) => {
  const results = [];
  const executing = new Set();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const promise = Promise.resolve().then(() => iteratorFn(item)).then((res) => {
      results[i] = res;
      executing.delete(promise);
    });

    executing.add(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
};

// Пример вызова:
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
asyncPool(2, [100, 200, 50, 150], (ms) => delay(ms).then(() => ms)).then(console.log);
