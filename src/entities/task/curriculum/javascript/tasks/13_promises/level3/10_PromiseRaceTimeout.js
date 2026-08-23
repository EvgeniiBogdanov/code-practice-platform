// Напишите функцию withTimeout(promise, ms), которая
// отклоняет промис с ошибкой "Timeout", если promise
// не выполнился за ms миллисекунд.

const slowRequest = new Promise((resolve) =>
  setTimeout(() => resolve("данные"), 2000)
);

const withTimeout = (promise, ms) => {
  // Решение тут
};

// Пример вызова:
withTimeout(slowRequest, 500).then(console.log).catch(console.error);
