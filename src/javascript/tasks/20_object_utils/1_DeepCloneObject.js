// Глубокое копирование объектов
// Реализуйте функцию deepClone(obj, map), которая создает глубокую копию переданного объекта.
// Функция должна корректно обрабатывать примитивы, вложенные объекты, массивы, а также циклические ссылки (используя WeakMap).

const deepClone = (obj, map = new WeakMap()) => {
  // Ваш код здесь
};

const original = {
  name: "Alice",
  age: 25,
  skills: ["JS", "React"],
  nested: {
    a: 1,
  },
};
original.self = original; // Циклическая ссылка

const copy = deepClone(original);

console.log(copy !== original); // true
console.log(copy.nested !== original.nested); // true
console.log(copy.skills !== original.skills); // true
console.log(copy.self === copy); // true
