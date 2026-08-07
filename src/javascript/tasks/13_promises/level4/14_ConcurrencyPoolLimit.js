// Дан массив из 10 задач (функций, возвращающих Promise).
// Напишите runWithLimit(tasks, limit), которая выполняет их
// параллельно, но не более `limit` одновременно,
// и возвращает массив результатов в исходном порядке.

const tasks = Array.from({ length: 10 }, (_, i) => () =>
  new Promise((resolve) => setTimeout(() => resolve(i), 100))
);

const runWithLimit = (tasks, limit) => {
  // Ваш код здесь
};

runWithLimit(tasks, 3).then(console.log);
