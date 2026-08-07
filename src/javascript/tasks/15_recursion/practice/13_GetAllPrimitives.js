// Собрать все примитивы во вложенной структуре
// Вывод: [8, 1, 2, 7, 10, 4]

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
  // Ваш код здесь
};

console.log(getAllPrimitives(obj));
