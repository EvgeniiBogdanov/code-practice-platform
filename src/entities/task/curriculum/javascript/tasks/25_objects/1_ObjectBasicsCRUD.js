// Базовые операции со свойствами объекта (CRUD & Computed Keys)
// Напишите функцию manageUser(user, newKey, newValue, deleteKey), которая:
// 1. Принимает объект user, имя нового свойства newKey со значением newValue и имя удаляемого свойства deleteKey.
// 2. Если newKey передан, добавляет или перезаписывает свойство user[newKey] со значением newValue.
// 3. Если deleteKey передан, удаляет свойство deleteKey из объекта с помощью оператора delete.
// 4. Корректно обрабатывает случай, если передан не объект (или null).
// 5. Возвращает модифицированный объект user.

const manageUser = (user, newKey, newValue, deleteKey) => {
  // Решение тут
};

// Пример вызова:
const user = { name: "Alice", age: 25, role: "admin" };
console.log(manageUser(user, "city", "Berlin", "role"));
// { name: 'Alice', age: 25, city: 'Berlin' }

const user2 = { id: 101, tempStatus: "pending" };
console.log(manageUser(user2, "isActive", true, "tempStatus"));
// { id: 101, isActive: true }
