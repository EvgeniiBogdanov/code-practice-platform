// Напишите функцию withTimeout(promise, ms), которая отклоняет промис с ошибкой new Error("Timeout"),
// если переданный промис не успел выполниться за ms миллисекунд. Используйте Promise.race.

const slowRequest = new Promise((resolve) =>
  setTimeout(() => resolve("данные"), 2000)
);

const withTimeout = (promise, ms) => {
  // Решение тут
};

// Пример вызова:
withTimeout(slowRequest, 500).then(console.log).catch(console.error);
