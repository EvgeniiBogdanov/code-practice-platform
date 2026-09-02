// Пул асинхронных задач с лимитом параллелизма
// Реализуйте функцию asyncPool(limit, items, iteratorFn), которая выполняет асинхронные задачи над элементами items с максимальным количеством одновременных вызовов limit.

const asyncPool = async (limit, items, iteratorFn) => {
  // Решение тут
};

// Пример вызова:
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
asyncPool(2, [100, 200, 50, 150], (ms) => delay(ms).then(() => ms)).then(console.log);
