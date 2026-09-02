// Пул асинхронных задач с ограничением конкурентности
// Реализуйте функцию asyncPool(limit, items, iteratorFn), выполняющую операции с параллелизмом не более limit.

const asyncPool = async (limit, items, iteratorFn) => {
  // Решение тут
};

// Пример вызова:
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
asyncPool(2, [100, 200, 50, 150], (ms) => delay(ms).then(() => ms)).then(console.log);
