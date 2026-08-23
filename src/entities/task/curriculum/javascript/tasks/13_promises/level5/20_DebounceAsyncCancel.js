// Асинхронный Debounce с отменой предыдущих запросов
// Напишите debounceAsync(fn, ms), которая задерживает вызов и отменяет незавершенные вызовы.

const debounceAsync = (fn, ms) => {
  // Решение тут
};

// Пример вызова:
const search = (q) => new Promise((r) => setTimeout(() => r(`Result ${q}`), 100));
const debounced = debounceAsync(search, 200);
debounced("a").catch(() => {});
debounced("ab").then(console.log); // "Result ab"
