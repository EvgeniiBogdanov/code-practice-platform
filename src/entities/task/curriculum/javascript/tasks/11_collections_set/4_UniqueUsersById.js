// Дедупликация массива объектов по полю ID
// Напишите функцию getUniqueUsers(users), которая удаляет дубликаты пользователей по их свойству id, сохраняя первое встреченное вхождение.

const users = [
  { id: 1, name: "Ann" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Ann 2" },
  { id: 3, name: "Kate" },
];

const getUniqueUsers = (users) => {
  // Решение тут
};

// Пример вызова:
console.log(getUniqueUsers(users));
// [
//   { id: 1, name: "Ann" },
//   { id: 2, name: "Bob" },
//   { id: 3, name: "Kate" }
// ]
