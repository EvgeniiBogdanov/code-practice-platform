// Выборка заданных свойств объекта (pick)
// Напишите функцию pick(obj, keys), которая возвращает новый объект, содержащий только те свойства из массива keys, которые реально присутствуют в исходном объекте.

const pick = (obj, keys) => {
  // Решение тут
};

// Пример вызова:
const user = { id: 1, name: "John", email: "john@example.com", role: "admin" };
console.log(pick(user, ["name", "email"])); // { name: 'John', email: 'john@example.com' }
console.log(pick(user, ["id", "unknownKey"])); // { id: 1 }
