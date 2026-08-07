function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    const list = Array.from(promises);
    if (list.length === 0) {
      return resolve([]);
    }

    const results = new Array(list.length);
    let completed = 0;

    list.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          results[index] = { status: 'fulfilled', value };
        })
        .catch((reason) => {
          results[index] = { status: 'rejected', reason };
        })
        .finally(() => {
          completed += 1;
          if (completed === list.length) {
            resolve(results);
          }
        });
    });
  });
}

// Пример использования:
const p1 = Promise.resolve(42);
const p2 = Promise.reject("Ошибка сервера");
const p3 = new Promise((resolve) => setTimeout(() => resolve("Успех"), 50));

promiseAllSettled([p1, p2, p3]).then(console.log);
