function asyncLimit(tasks, limit) {
  return new Promise((resolve, reject) => {
    const results = new Array(tasks.length);
    let activeCount = 0;
    let completedCount = 0;
    let currentIndex = 0;

    function runNext() {
      if (completedCount === tasks.length) {
        return resolve(results);
      }

      while (activeCount < limit && currentIndex < tasks.length) {
        const index = currentIndex;
        const taskFn = tasks[currentIndex];
        currentIndex += 1;
        activeCount += 1;

        Promise.resolve()
          .then(() => taskFn())
          .then((val) => {
            results[index] = val;
          })
          .catch(reject)
          .finally(() => {
            activeCount -= 1;
            completedCount += 1;
            runNext();
          });
      }
    }

    runNext();
  });
}

// Пример использования:
const makeTask = (id, ms) => () =>
  new Promise((res) => setTimeout(() => res(`Task ${id}`), ms));

const tasks = [
  makeTask(1, 100),
  makeTask(2, 50),
  makeTask(3, 80),
  makeTask(4, 20),
];

asyncLimit(tasks, 2).then(console.log);
