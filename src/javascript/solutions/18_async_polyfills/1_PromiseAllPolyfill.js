function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const list = Array.from(promises);
    if (list.length === 0) {
      return resolve([]);
    }

    const results = new Array(list.length);
    let completed = 0;

    list.forEach((item, index) => {
      Promise.resolve(item)
        .then((val) => {
          results[index] = val;
          completed += 1;
          if (completed === list.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// Пример использования:
const p1 = Promise.resolve(10);
const p2 = new Promise((resolve) => setTimeout(() => resolve(20), 100));
const p3 = 30;

promiseAll([p1, p2, p3]).then(console.log).catch(console.error); // [10, 20, 30]

const pErr = new Promise((_, reject) => setTimeout(() => reject("Error!"), 50));
promiseAll([p1, pErr, p2]).then(console.log).catch(console.error); // "Error!"
