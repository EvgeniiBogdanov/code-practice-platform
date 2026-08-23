// Выпрямление вложенного объекта в ключи через точку
// Напишите функцию flattenObject(obj).

const flattenObject = (obj, prefix = "") => {
  // Решение тут
};

// Пример вызова:
const nested = { a: { b: { c: 1 } }, d: 2 };
console.log(flattenObject(nested)); // { "a.b.c": 1, "d": 2 }
