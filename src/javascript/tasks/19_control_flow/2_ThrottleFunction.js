// Реализация Throttle
// Напишите функцию throttle(fn, limit), пропускающую вызовы не чаще раза в limit мс.

const throttle = (fn, limit) => {
  // Решение тут
};

// Пример вызова:
const throttled = throttle((val) => console.log(val), 200);
throttled("первый");
throttled("пропущен");
