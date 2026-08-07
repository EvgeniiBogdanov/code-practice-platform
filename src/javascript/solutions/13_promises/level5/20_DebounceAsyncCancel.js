const CANCELLED = Symbol("cancelled");

const search = (query) =>
  new Promise((resolve) => setTimeout(() => resolve(`Результаты по "${query}"`), 200));

const debounceAsync = (fn, ms) => {
  let timer = null;
  let currentReject = null;

  return (...args) => {
    return new Promise((resolve, reject) => {
      if (timer) {
        clearTimeout(timer);
        if (currentReject) currentReject(CANCELLED);
      }

      currentReject = reject;

      timer = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, ms);
    });
  };
};

const debouncedSearch = debounceAsync(search, 300);

debouncedSearch("a").catch((e) => {
  if (e === CANCELLED) console.log("Вызов 'a' отменён");
});
debouncedSearch("ab").catch((e) => {
  if (e === CANCELLED) console.log("Вызов 'ab' отменён");
});
debouncedSearch("abc").then(console.log);
