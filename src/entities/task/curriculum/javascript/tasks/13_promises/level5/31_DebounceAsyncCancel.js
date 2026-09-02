// Асинхронный Debounce с отменой предыдущих запросов
// Напишите функцию debounceAsync(fn, ms), которая задерживает вызов и передает сигнал отмены (AbortSignal) для незавершенных предыдущих вызовов.

const debounceAsync = (fn, ms) => {
  // Решение тут
};

// Пример вызова:
const search = (q, signal) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => resolve(`Result ${q}`), 100);
  signal?.addEventListener("abort", () => {
    clearTimeout(timer);
    reject(new DOMException("Aborted", "AbortError"));
  });
});

const debounced = debounceAsync(search, 50);
debounced("a").catch((err) => console.log("a cancelled:", err.name));
debounced("ab").then((res) => console.log("ab success:", res));
