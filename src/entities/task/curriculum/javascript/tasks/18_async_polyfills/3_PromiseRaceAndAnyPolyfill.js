// Реализация полифилов Promise.race и Promise.any
// Реализуйте функции promiseRace(promises) и promiseAny(promises).

const promiseRace = (promises) => {
  // Решение тут
};

const promiseAny = (promises) => {
  // Решение тут
};

// Пример вызова:
promiseRace([
  new Promise((r) => setTimeout(() => r("fast"), 50)),
  new Promise((r) => setTimeout(() => r("slow"), 100)),
]).then(console.log); // "fast"
