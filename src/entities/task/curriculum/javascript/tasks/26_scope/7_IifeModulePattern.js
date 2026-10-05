// IIFE и паттерн «Модуль»
// С помощью IIFE (немедленно вызываемой функции) создайте модуль counterModule.
// Модуль хранит приватный счётчик и наружу отдаёт только методы:
// - increment() — увеличивает счётчик на 1 и возвращает новое значение
// - decrement() — уменьшает счётчик на 1 и возвращает новое значение
// - getValue() — возвращает текущее значение
// - reset() — сбрасывает счётчик в 0
// Сам счётчик не должен быть доступен снаружи.

const counterModule = (() => {
  // Решение тут
})();

// Пример вызова:
console.log(counterModule.increment()); // 1
console.log(counterModule.increment()); // 2
console.log(counterModule.decrement()); // 1
console.log(counterModule.getValue()); // 1
console.log(counterModule.count); // undefined — счётчик приватный
counterModule.reset();
console.log(counterModule.getValue()); // 0
