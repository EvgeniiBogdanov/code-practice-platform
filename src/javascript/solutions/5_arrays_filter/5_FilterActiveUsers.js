const users = [
  { name: "Анна", isActive: true },
  { name: "Иван", isActive: false },
  { name: "Мария", isActive: true },
];

const filterActiveUsers = (users) => {
  return users.filter((user) => user.isActive);
};

// Пример вызова:
console.log(filterActiveUsers(users));
// [
//   { name: "Анна", isActive: true },
//   { name: "Мария", isActive: true }
// ]
