const tasks = Array.from({ length: 10 }, (_, i) => () =>
  new Promise((resolve) => setTimeout(() => resolve(i), 100))
);

const runWithLimit = (tasks, limit) => {
  return new Promise((resolve) => {
    const results = new Array(tasks.length);
    let nextIndex = 0;
    let completed = 0;

    if (tasks.length === 0) return resolve([]);

    const runNext = () => {
      const currentIndex = nextIndex++;
      if (currentIndex >= tasks.length) return;

      tasks[currentIndex]()
        .then((result) => {
          results[currentIndex] = result;
        })
        .finally(() => {
          completed++;
          if (completed === tasks.length) resolve(results);
          else runNext();
        });
    };

    for (let i = 0; i < Math.min(limit, tasks.length); i++) {
      runNext();
    }
  });
};

runWithLimit(tasks, 3).then(console.log);
