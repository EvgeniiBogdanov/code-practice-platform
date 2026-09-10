// Преобразование вложенного объекта в плоский (flattenObject)
// Напишите функцию flattenObject(obj, prefix = ""), которая преобразует вложенный объект в плоский словарь с ключами через точку.

const flattenObject = (obj, prefix = "") => {
  // Решение тут
};

// Пример вызова:
const nested = {
  user: {
    name: "Alice",
    address: {
      city: "Paris",
      zip: 75001,
    },
  },
  roles: ["admin", "editor"],
  flags: {},
};

console.log(flattenObject(nested));
// {
//   'user.name': 'Alice',
//   'user.address.city': 'Paris',
//   'user.address.zip': 75001,
//   'roles.0': 'admin',
//   'roles.1': 'editor',
//   'flags': {}
// }

console.log(flattenObject({ a: 1, b: { c: 2 } }));
// { 'a': 1, 'b.c': 2 }
