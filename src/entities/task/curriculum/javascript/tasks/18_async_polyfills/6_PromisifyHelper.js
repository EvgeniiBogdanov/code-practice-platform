// Утилита promisify для Node.js стиля колбэков
// Напишите функцию promisify(fn), оборачивающую функцию с callback (err, result) в Promise.

const promisify = (fn) => {
  // Решение тут
};

// Пример вызова:
const mockAsync = (arg, cb) => cb(null, `data: ${arg}`);
const asyncFn = promisify(mockAsync);

asyncFn("test").then(console.log); // "data: test"
