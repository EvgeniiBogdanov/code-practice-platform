// Обертка промиса с ограничением по времени (withTimeout)
// Напишите функцию withTimeout(promise, ms), которая отклоняет результат с ошибкой 'Timeout Error', если переданный промис не завершился за ms миллисекунд.

const withTimeout = (promise, ms) => {
  // Решение тут
};

// Пример вызова:
const slow = new Promise((r) => setTimeout(() => r("успех"), 500));
withTimeout(slow, 100).catch((err) => console.log(err.message)); // 'Timeout Error'
