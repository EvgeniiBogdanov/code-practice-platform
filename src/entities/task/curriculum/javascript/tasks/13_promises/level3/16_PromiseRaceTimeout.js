// Таймаут для промиса (Promise timeout)
// Напишите функцию withTimeout(promise, ms), которая отклоняет промис с ошибкой "Timeout Error", если он не успел выполниться за ms миллисекунд.

const withTimeout = (promise, ms) => {
  // Решение тут
};

// Пример вызова:
const slow = new Promise((r) => setTimeout(() => r("done"), 1000));
withTimeout(slow, 200).catch(console.error); // "Timeout Error"
