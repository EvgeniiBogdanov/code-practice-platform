// Рекурсивный setTimeout вместо setInterval
// Реализуйте функцию interval(fn, delay), использующую рекурсивный setTimeout.

const interval = (fn, delay) => {
  // Решение тут
};

// Пример вызова:
const stop = interval(() => console.log("tick"), 1000);
setTimeout(stop, 3500);
