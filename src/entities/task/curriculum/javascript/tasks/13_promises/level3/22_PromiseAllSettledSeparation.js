// Разделение результатов асинхронных операций
// Напишите функцию splitResults(requests), которая возвращает объект { fulfilled: [], rejected: [] } с разделенными результатами выполнения всех переданных промисов.

const splitResults = async (requests) => {
  // Решение тут
};

// Пример вызова:
const reqs = [
  Promise.resolve(1),
  Promise.reject("ошибка А"),
  Promise.resolve(3),
  Promise.reject("ошибка Б"),
];

splitResults(reqs).then(console.log);
// { fulfilled: [1, 3], rejected: ["ошибка А", "ошибка Б"] }
