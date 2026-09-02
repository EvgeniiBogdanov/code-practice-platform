// Реализация функции throttle
// Напишите функцию throttle(fn, ms), которая гарантирует, что функция fn вызывается не чаще одного раза в ms миллисекунд.

const throttle = (fn, ms) => {
  // Решение тут
};

// Пример вызова:
const log = throttle((val) => console.log("Throttled:", val), 300);
log("A"); // Выполнится сразу
log("B"); // Игнорируется
setTimeout(() => log("C"), 400); // Выполнится
