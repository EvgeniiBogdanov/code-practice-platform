// Глубокое клонирование с поддержкой циклических ссылок
// Напишите функцию deepClone(value, visited = new WeakMap()), которая создает полную глубокую копию значения с корректной обработкой вложенных объектов, массивов, Date, RegExp и циклических ссылок (через WeakMap).

const deepClone = (value, visited = new WeakMap()) => {
  // Решение тут
};

// Пример вызова:
const original = {
  name: "Alice",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  pattern: /hello/gi,
  skills: ["React", "JavaScript"],
  nested: { count: 42 },
};

original.self = original;

const copy = deepClone(original);
console.log(copy !== original);               // true
console.log(copy.nested !== original.nested); // true
console.log(copy.skills !== original.skills); // true
console.log(copy.createdAt instanceof Date);  // true
console.log(copy.createdAt.toISOString());    // '2025-01-01T00:00:00.000Z'
console.log(copy.pattern instanceof RegExp);  // true
console.log(copy.self === copy);              // true
