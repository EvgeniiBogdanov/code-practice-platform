// Ограничение параллельного выполнения промисов (Concurrency Pool)
// Напишите функцию runWithLimit(tasks, limit), выполняющую задачи параллельно с лимитом limit.

const runWithLimit = (tasks, limit) => {
  // Решение тут
};

// Пример вызова:
const tasks = Array.from({ length: 5 }, (_, i) => () =>
  new Promise((resolve) => setTimeout(() => resolve(i), 100))
);

runWithLimit(tasks, 2).then(console.log); // [0, 1, 2, 3, 4]
