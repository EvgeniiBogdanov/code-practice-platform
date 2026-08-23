// Глубокое сравнение объектов (Deep Equal)
// Напишите функцию deepEqual(a, b), сравнивающую объекты по значениям.

const deepEqual = (a, b) => {
  // Решение тут
};

// Пример вызова:
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual({ a: 1 }, { a: 2 }));                           // false
