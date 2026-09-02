// Симуляция setInterval через рекурсивный setTimeout
// Реализуйте функцию interval(fn, delay), которая периодически вызывает функцию fn с задержкой delay и возвращает функцию остановки.

const interval = (fn, delay) => {
  // Решение тут
};

// Пример вызова:
const stop = interval(() => console.log("tick"), 1000);
setTimeout(stop, 3500);
