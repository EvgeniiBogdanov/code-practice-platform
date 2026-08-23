const findUserByName = (users, name) => {
  return users.find((user) => user.name === name);
};

const users = [
  { id: 1, name: "Анна" },
  { id: 2, name: "Иван" },
  { id: 3, name: "Мария" },
];

// Пример вызова:
console.log(findUserByName(users, "Иван")); // { id: 2, name: "Иван" }
console.log(findUserByName(users, "Пётр")); // undefined
