// Симуляция setInterval через рекурсивный setTimeout
// Реализуйте функцию interval(fn, delay), которая вызывает fn каждые delay миллисекунд
// и возвращает функцию остановки. Используйте вложенный setTimeout, а не setInterval.
// Остановка должна работать, даже если её вызвать изнутри самой fn.

const interval = (fn, delay) => {
  // Решение тут
};

// Пример вызова:
let ticks = 0;
const stop = interval(() => {
  ticks++;
  console.log(`tick ${ticks}`);
}, 100);

setTimeout(() => {
  stop();
  console.log(`Остановлено после ${ticks} тиков`); // "Остановлено после 3 тиков"
}, 350);

let calls = 0;
const stopSelf = interval(() => {
  calls++;
  if (calls === 2) {
    stopSelf(); // остановка изнутри колбэка
  }
}, 50);

setTimeout(() => {
  console.log(`Самоостановка после ${calls} вызовов`); // "Самоостановка после 2 вызовов"
}, 400);
