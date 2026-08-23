const CANCELLED = Symbol("cancelled");

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

// Пример вызова:
const search = (q) => new Promise((r) => setTimeout(() => r(`Result ${q}`), 100));
const debounced = debounceAsync(search, 200);
debounced("a").catch(() => {});
debounced("ab").then(console.log); // "Result ab"
