// Деструктуризация объектов (Алиасы, дефолты и rest)
// Напишите функцию normalizeUser(rawUser = {}), которая:
// 1. Извлекает поля id и name из переданного объекта пользователя.
// 2. Переименовывает email в userEmail со значением по умолчанию "no-email@example.com".
// 3. Задает значение по умолчанию для поля role равным "guest".
// 4. Собирает все остальные свойства в объект extra с помощью оператора ...rest.
// 5. Возвращает нормализованный объект { id, name, userEmail, role, extra }.

const normalizeUser = (rawUser = {}) => {
  // Решение тут
};

// Пример вызова:
const user1 = {
  id: 1,
  name: "Bob",
  email: "bob@test.com",
  role: "admin",
  city: "London",
  hobby: "chess",
};

console.log(normalizeUser(user1));
// {
//   id: 1,
//   name: 'Bob',
//   userEmail: 'bob@test.com',
//   role: 'admin',
//   extra: { city: 'London', hobby: 'chess' }
// }

const user2 = {
  id: 2,
  name: "Anonymous",
};

console.log(normalizeUser(user2));
// {
//   id: 2,
//   name: 'Anonymous',
//   userEmail: 'no-email@example.com',
//   role: 'guest',
//   extra: {}
// }
