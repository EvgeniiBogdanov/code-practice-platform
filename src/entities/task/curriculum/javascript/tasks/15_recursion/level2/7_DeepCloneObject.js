// Глубокое клонирование объекта (Deep Clone)
// Напишите функцию deepClone(value), которая создает полную независимую копию вложенного объекта или массива.

const deepClone = (value) => {
  // Решение тут
};

// Пример вызова:
const original = { a: 1, b: { c: [1, 2, { d: 3 }] } };
const cloned = deepClone(original);
cloned.b.c[2].d = 999;
console.log(original.b.c[2].d); // 3
console.log(cloned.b.c[2].d);   // 999
