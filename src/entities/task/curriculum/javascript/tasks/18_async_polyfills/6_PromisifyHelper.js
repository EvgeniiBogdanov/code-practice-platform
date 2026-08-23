// Утилита promisify для Node.js стиля колбэков
// Напишите функцию promisify(fn), возвращающую функцию, возвращающую Promise.

const promisify = (fn) => {
  // Решение тут
};

// Пример вызова:
const mockAsync = (arg, cb) => cb(null, `data: ${arg}`);
const asyncFn = promisify(mockAsync);

asyncFn("test").then(console.log); // "data: test"
