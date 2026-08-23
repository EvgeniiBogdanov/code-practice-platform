// Реализация функции debounce
// Напишите функцию debounce(fn, ms), которая задерживает вызов fn на ms миллисекунд.

const debounce = (fn, ms) => {
  // Решение тут
};

// Пример вызова:
const log = debounce((msg) => console.log(msg), 300);
log("a");
log("b");
log("c"); // Выведет "c" через 300 мс
