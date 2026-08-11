const promiseRace = (promises) => {
  return new Promise((resolve, reject) => {
    promises.forEach((p) => Promise.resolve(p).then(resolve, reject));
  });
};

const promiseAny = (promises) => {
  return new Promise((resolve, reject) => {
    const errors = [];
    let rejectedCount = 0;
    const total = promises.length;

    if (total === 0) {
      return reject(new AggregateError([], "All promises were rejected"));
    }

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(resolve)
        .catch((err) => {
          errors[index] = err;
          rejectedCount++;
          if (rejectedCount === total) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
};

promiseRace([
  new Promise((r) => setTimeout(() => r("fast"), 50)),
  new Promise((r) => setTimeout(() => r("slow"), 100)),
]).then(console.log); // "fast"
