const runWithLimit = async (tasks, limit) => {
  const results = [];
  const executing = new Set();

  for (let i = 0; i < tasks.length; i++) {
    const taskPromise = Promise.resolve().then(() => tasks[i]()).then((res) => {
      results[i] = res;
      executing.delete(taskPromise);
    });

    executing.add(taskPromise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
};

const tasks = Array.from({ length: 5 }, (_, i) => () =>
  new Promise((resolve) => setTimeout(() => resolve(i), 100))
);

// Пример вызова:
runWithLimit(tasks, 2).then(console.log); // [0, 1, 2, 3, 4]
