// Отмена промиса через AbortController
// Напишите функцию fetchWithCancel(url, signal), поддерживающую отмену через AbortController.

const fetchWithCancel = (url, signal) => {
  // Решение тут
};

// Пример вызова:
const controller = new AbortController();
fetchWithCancel("/api/data", controller.signal)
  .then(console.log)
  .catch(console.error);

setTimeout(() => controller.abort(), 50);
