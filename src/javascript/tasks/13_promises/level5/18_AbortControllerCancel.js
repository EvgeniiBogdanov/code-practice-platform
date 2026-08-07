// Напишите функцию fetchWithCancel(url, signal), эмулирующую
// запрос, который можно отменить через AbortController.
// При отмене промис должен реджектиться с ошибкой "Aborted".

const fetchWithCancel = (url, signal) => {
  // Ваш код здесь
};

const controller = new AbortController();
fetchWithCancel("/api/data", controller.signal)
  .then(console.log)
  .catch(console.error);

setTimeout(() => controller.abort(), 100);
