const users = [
  { firstName: "Иван", lastName: "Иванов" },
  { firstName: "Анна", lastName: "Петрова" },
];

const getFullNames = (users) => {
  return users.map((user) => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  }));
};

// Пример вызова:
console.log(getFullNames(users));
// [
//   { firstName: "Иван", lastName: "Иванов", fullName: "Иван Иванов" },
//   { firstName: "Анна", lastName: "Петрова", fullName: "Анна Петрова" }
// ]
