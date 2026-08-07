function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };
}

// Пример использования (Node.js style callback):
const legacyAsyncAdd = (a, b, callback) => {
  setTimeout(() => {
    if (typeof a !== "number" || typeof b !== "number") {
      return callback(new Error("Некорректные аргументы"));
    }
    callback(null, a + b);
  }, 50);
};

const promisifiedAdd = promisify(legacyAsyncAdd);
promisifiedAdd(5, 15).then(console.log).catch(console.error);
