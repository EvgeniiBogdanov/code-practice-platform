// Исключение заданных свойств объекта (omit)
// Напишите функцию omit(obj, keys), которая возвращает новый объект, содержащий все собственные свойства obj, кроме перечисленных в массиве keys.

const omit = (obj, keys) => {
  // Решение тут
};

// Пример вызова:
const user = { id: 1, name: "Alice", passwordHash: "secret_123", role: "admin" };
console.log(omit(user, ["passwordHash"])); // { id: 1, name: 'Alice', role: 'admin' }
