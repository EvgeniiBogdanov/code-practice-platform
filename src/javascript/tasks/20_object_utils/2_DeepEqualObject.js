// Глубокое сравнение объектов
// Реализуйте функцию deepEqual(a, b), которая рекурсивно сравнивает два значения на равенство.
// Она должна корректно сравнивать примитивы, объекты и массивы.

const deepEqual = (a, b) => {
  // Ваш код здесь
};

const obj1 = { a: 1, b: { c: 2 }, d: [1, 2] };
const obj2 = { a: 1, b: { c: 2 }, d: [1, 2] };
const obj3 = { a: 1, b: { c: 3 }, d: [1, 2] };

console.log(deepEqual(obj1, obj2)); // true
console.log(deepEqual(obj1, obj3)); // false
console.log(deepEqual(5, 5)); // true
console.log(deepEqual(null, undefined)); // false
