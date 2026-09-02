// Параллельное выполнение нескольких запросов
// Напишите функцию fetchAll(urls), загружающую все URL параллельно.

const fetchUrl = (url) => Promise.resolve(`Данные с ${url}`);

const fetchAll = (urls) => {
  // Решение тут
};

// Пример вызова:
fetchAll(["/api/1", "/api/2"]).then(console.log);
