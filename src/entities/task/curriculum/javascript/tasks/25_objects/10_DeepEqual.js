// Глубокое сравнение объектов по значению (deepEqual)
// Напишите функцию deepEqual(a, b), которая сравнивает две структуры данных на равенство по значению.
//
// Требования:
// 1. Примитивы сравниваются по значению (NaN равен NaN).
// 2. Объекты и массивы сравниваются по содержимому всех свойств и элементов.
// 3. Порядок ключей в объектах не имеет значения.

const deepEqual = (a, b) => {
  // Решение тут
};

// Пример вызова:
console.log(deepEqual(1, 1));                                         // true
console.log(deepEqual(NaN, NaN));                                     // true
console.log(deepEqual([1, [2, 3]], [1, [2, 3]]));                     // true
console.log(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }));               // true
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual([1, 2], [1, 2, 3]));                            // false
