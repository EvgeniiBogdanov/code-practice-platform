// Ограничение времени выполнения промиса (withTimeout)
// Напишите функцию withTimeout(promise, timeoutMs).

const withTimeout = (promise, timeoutMs) => {
  // Решение тут
};

// Пример вызова:
const slowPromise = new Promise((resolve) => setTimeout(() => resolve("done"), 3000));
withTimeout(slowPromise, 1000)
  .then(console.log)
  .catch((err) => console.log(err.message)); // "TimeoutError"
