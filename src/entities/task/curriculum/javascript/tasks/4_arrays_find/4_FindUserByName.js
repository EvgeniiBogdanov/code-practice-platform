// Поиск пользователя по имени
// Напишите функцию findUserByName(users, name), которая находит объект пользователя с указанным именем.

const findUserByName = (users, name) => {
  // Решение тут
};

const users = [
  { id: 1, name: "Анна" },
  { id: 2, name: "Иван" },
  { id: 3, name: "Мария" },
];

// Пример вызова:
console.log(findUserByName(users, "Иван")); // { id: 2, name: "Иван" }
console.log(findUserByName(users, "Пётр")); // undefined
