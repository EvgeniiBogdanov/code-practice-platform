// Реализация запроса с таймаутом через Promise.race
// Напишите функцию fetchWithTimeout(url, ms), которая возвращает данные запроса либо падает с ошибкой, если ответ не пришел за ms миллисекунд.

const mockRequest = (url) => new Promise((r) => setTimeout(() => r(`Успех ${url}`), 300));

const fetchWithTimeout = (url, ms) => {
  // Решение тут
};

// Пример вызова:
fetchWithTimeout("/api/data", 100).catch((e) => console.log(e.message)); // "Превышено время ожидания"
fetchWithTimeout("/api/data", 500).then(console.log);                     // "Успех /api/data"
