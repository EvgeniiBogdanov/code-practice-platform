// Напишите функцию deepClone(obj), которая рекурсивно клонирует объект/массив
// любой вложенности (без JSON.parse/stringify).
// Вход → Выход
// { a: 1, b: { c: [1, 2, { d: 3 }] } } → независимая копия

const deepClone = (value) => {
  // Ваш код здесь
};

const original = { a: 1, b: { c: [1, 2, { d: 3 }] } };
const cloned = deepClone(original);
cloned.b.c[2].d = 999;
console.log(original.b.c[2].d, cloned.b.c[2].d); // 3 999
