function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    let counter = 0;
    const result = [];

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          result[index] = value;
          counter++;

          if (counter === promises.length) {
            resolve(result);
          }
        })
        .catch(reject);
    });
  });
}

promiseAll([
  Promise.resolve(1),
  new Promise((resolve) => setTimeout(() => resolve(2), 100)),
  3,
]).then(console.log);
