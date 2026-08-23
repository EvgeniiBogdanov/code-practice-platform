// Таймаут для запроса через Promise.race
// Напишите функцию withTimeout(promise, ms), которая отклоняет результат с ошибкой "Timeout",
// если промис не выполнился за ms миллисекунд.

const withTimeout = (promise, ms) => {
  // Решение тут
};

// Пример вызова:
const slowOp = new Promise((r) => setTimeout(() => r("Успех"), 500));
withTimeout(slowOp, 200).catch(console.error); // "Timeout"
