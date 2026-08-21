// Инверсия объекта (ключи и значения)
// Напишите функцию invertObject(obj), которая принимает объект и возвращает новый объект, где ключи стали значениями, а значения — ключами с помощью цикла for...in.

const invertObject = (obj) => {
  // Решение тут
};

// Пример вызова:
const roles = {
  admin: "1",
  editor: "2",
  viewer: "3",
};

console.log(invertObject(roles));
// { "1": "admin", "2": "editor", "3": "viewer" }
