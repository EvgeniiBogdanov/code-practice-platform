// Парсер и сериализатор строки запроса (Query String)
// Напишите функции parseQueryString(url) и stringifyQuery(params).

const parseQueryString = (url) => {
  // Решение тут
};

const stringifyQuery = (params) => {
  // Решение тут
};

// Пример вызова:
const parsed = parseQueryString("https://example.com?q=hello%20world&tags=js&tags=web&debug");
console.log(parsed); // { q: "hello world", tags: ["js", "web"], debug: true }

const stringified = stringifyQuery(parsed);
console.log(stringified); // "q=hello%20world&tags=js&tags=web&debug=true"
