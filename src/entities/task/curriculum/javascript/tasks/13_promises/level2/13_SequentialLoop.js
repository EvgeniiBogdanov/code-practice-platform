// Последовательная обработка массива асинхронных операций
// Напишите функцию processInSequence(urls, fetchFn), которая запрашивает данные по URL строго последовательно и возвращает массив результатов.

const mockFetch = (url) => new Promise((r) => setTimeout(() => r(`data from ${url}`), 50));

const processInSequence = async (urls, fetchFn) => {
  // Решение тут
};

// Пример вызова:
processInSequence(["/a", "/b", "/c"], mockFetch).then(console.log);
// [ "data from /a", "data from /b", "data from /c" ]
