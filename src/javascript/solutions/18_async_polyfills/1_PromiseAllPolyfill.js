const promiseAll = (promises) => {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    const total = promises.length;

    if (total === 0) {
      return resolve([]);
    }

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((val) => {
          results[index] = val;
          completed++;
          if (completed === total) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
};

promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  3,
]).then(console.log); // [1, 2, 3]
