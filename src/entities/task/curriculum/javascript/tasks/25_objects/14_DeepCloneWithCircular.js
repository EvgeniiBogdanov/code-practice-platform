// Глубокое клонирование с поддержкой циклических ссылок
// Напишите функцию deepClone(value), которая создает полную глубокую копию значения с корректной обработкой вложенных объектов, массивов, Date, RegExp, Map, Set и циклических ссылок.

const deepClone = (value, visited = new WeakMap()) => {
  // Решение тут
};

// Пример вызова:
const original = { a: 1, b: { c: 2 } };
original.self = original; // циклическая ссылка

const cloned = deepClone(original);
console.log(cloned !== original);          // true
console.log(cloned.b !== original.b);      // true
console.log(cloned.self === cloned);       // true
