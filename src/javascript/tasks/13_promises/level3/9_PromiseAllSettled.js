// Обработка нескольких промисов через Promise.allSettled
// Напишите функцию splitResults(requests), разделяющую успешные и упавшие промисы.

const splitResults = async (requests) => {
  // Решение тут
};

// Пример вызова:
const requests = [
  Promise.resolve(1),
  Promise.reject("ошибка А"),
  Promise.resolve(3),
];
splitResults(requests).then(console.log);
// { fulfilled: [1, 3], rejected: ["ошибка А"] }
