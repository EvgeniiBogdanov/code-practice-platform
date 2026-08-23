// Глубокое клонирование объекта без потери вложенности
// Напишите функцию deepClone(obj).

const deepClone = (obj) => {
  // Решение тут
};

// Пример вызова:
const orig = { a: 1, b: { c: [2, 3] } };
const copy = deepClone(orig);
copy.b.c.push(4);
console.log(orig.b.c.length); // 2
console.log(copy.b.c.length); // 3
