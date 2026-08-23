const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
};

const mockAsync = (arg, cb) => cb(null, `data: ${arg}`);
const asyncFn = promisify(mockAsync);

asyncFn("test").then(console.log); // "data: test"
