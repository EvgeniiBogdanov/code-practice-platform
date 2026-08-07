// Дан массив запросов, часть из которых может упасть.
// Используя Promise.allSettled, выведите отдельно
// массив успешных значений и массив причин ошибок.

const requests = [
  Promise.resolve(1),
  Promise.reject("ошибка А"),
  Promise.resolve(3),
  Promise.reject("ошибка Б"),
];

async function splitResults() {
  // Ваш код здесь
}
