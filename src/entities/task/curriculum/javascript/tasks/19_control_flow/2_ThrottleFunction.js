// Реализация функции throttle
// Напишите функцию throttle(fn, limit), которая гарантирует, что функция fn вызывается не чаще одного раза в limit миллисекунд.

const throttle = (fn, limit) => {
  // Решение тут
};

// Пример вызова:
const throttled = throttle((val) => console.log(val), 200);
throttled("первый");
throttled("пропущен");

