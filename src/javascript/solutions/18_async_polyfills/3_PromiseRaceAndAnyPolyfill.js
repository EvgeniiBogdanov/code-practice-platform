function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const item of promises) {
      Promise.resolve(item).then(resolve, reject);
    }
  });
}

function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    const list = Array.from(promises);
    if (list.length === 0) return reject(new AggregateError([], "All promises were rejected"));

    const errors = new Array(list.length);
    let rejectedCount = 0;

    list.forEach((item, index) => {
      Promise.resolve(item)
        .then(resolve)
        .catch((err) => {
          errors[index] = err;
          rejectedCount += 1;
          if (rejectedCount === list.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
}

// Пример использования:
const slow = new Promise((res) => setTimeout(() => res("Slow"), 200));
const fast = new Promise((res) => setTimeout(() => res("Fast"), 50));

promiseRace([slow, fast]).then(console.log);
promiseAny([slow, fast]).then(console.log);
