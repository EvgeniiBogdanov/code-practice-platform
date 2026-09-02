// Повтор выполнения асинхронной функции с задержкой (Retry)
// Напишите функцию retry(fn, maxRetries, delayMs), выполняющую повторные вызовы fn при возникновении ошибок.

const retry = async (fn, maxRetries = 3, delayMs = 100) => {
  // Решение тут
};

// Пример вызова:
let tries = 0;
const operation = () => {
  tries++;
  return tries < 3 ? Promise.reject(new Error("Fail")) : Promise.resolve("Success");
};

retry(operation, 5, 50).then(console.log); // "Success"
