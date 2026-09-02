// Преобразование вложенного объекта в плоский (flattenObject)
// Напишите функцию flattenObject(obj), которая преобразует вложенный объект в плоский словарь с ключами через точку.

const flattenObject = (obj, prefix = "", result = {}) => {
  // Решение тут
};

// Пример вызова:
const nested = { a: 1, b: { c: 2, d: { e: 3 } } };
console.log(flattenObject(nested));
// { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
