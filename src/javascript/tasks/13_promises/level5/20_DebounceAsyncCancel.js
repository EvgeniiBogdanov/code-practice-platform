// Напишите debounceAsync(fn, ms), которая откладывает вызов fn
// на ms миллисекунд. Если функцию вызвали повторно до истечения
// таймера — предыдущий отложенный вызов отменяется.

const search = (query) =>
  new Promise((resolve) => setTimeout(() => resolve(`Результаты по "${query}"`), 200));

const debounceAsync = (fn, ms) => {
  // Ваш код здесь
};

const debouncedSearch = debounceAsync(search, 300);
debouncedSearch("a").then(console.log).catch((e) => console.log("a cancelled"));
debouncedSearch("ab").then(console.log).catch((e) => console.log("ab cancelled"));
debouncedSearch("abc").then(console.log);
