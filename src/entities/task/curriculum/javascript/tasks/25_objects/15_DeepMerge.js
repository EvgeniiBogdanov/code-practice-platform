// Глубокое слияние объектов (deepMerge)
// Напишите функцию deepMerge(target, ...sources), которая объединяет несколько объектов в единую глубокую структуру.
//
// Требования:
// 1. Вложенные plain-объекты с одинаковыми ключами объединяются рекурсивно.
// 2. Массивы объединяются (конкатенируются), примитивы перезаписываются последующими источниками.
// 3. Защита от Prototype Pollution: запрещено модифицировать свойства '__proto__', 'constructor', 'prototype'.

const deepMerge = (target, ...sources) => {
  // Решение тут
};

// Пример вызова:
const defaultOptions = {
  api: {
    host: "localhost",
    port: 3000,
    headers: { "X-App": "MyApp" },
  },
  tags: ["dev"],
  debug: false,
};

const userOptions = {
  api: {
    port: 8080,
    headers: { Authorization: "Bearer token" },
  },
  tags: ["v2"],
  debug: true,
};

const merged = deepMerge({}, defaultOptions, userOptions);
console.log(merged.api.host);                  // 'localhost'
console.log(merged.api.port);                  // 8080
console.log(merged.api.headers["X-App"]);      // 'MyApp'
console.log(merged.api.headers.Authorization); // 'Bearer token'
console.log(merged.tags);                      // ['dev', 'v2']
console.log(merged.debug);                     // true
