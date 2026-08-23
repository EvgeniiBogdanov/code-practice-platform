// Извлечение всех примитивных чисел из вложенного объекта
// Напишите функцию getAllPrimitives(obj), собирающую массив всех чисел объекта.

const obj = {
  a: {
    l: { u: 8 },
    b: 1,
  },
  c: {
    d: 2,
    e: { f: 7 },
    g: {
      m: {
        p: {
          o: 10,
        },
      },
    },
  },
  j: 4,
};

const getAllPrimitives = (obj) => {
  // Решение тут
};

// Пример вызова:
console.log(getAllPrimitives(obj)); // [8, 1, 2, 7, 10, 4]
