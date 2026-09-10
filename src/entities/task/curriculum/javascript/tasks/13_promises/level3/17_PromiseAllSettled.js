// Выполните массив запросов через Promise.allSettled и отделите массив успешных значений от массива причин ошибок.
// Функция splitResults() должна вернуть объект { fulfilled: [...], rejected: [...] }.

const requests = [
  Promise.resolve(1),
  Promise.reject("ошибка А"),
  Promise.resolve(3),
  Promise.reject("ошибка Б"),
];

async function splitResults() {
  // Решение тут
}

// Пример вызова:
splitResults().then(console.log);
// { fulfilled: [1, 3], rejected: ["ошибка А", "ошибка Б"] }
