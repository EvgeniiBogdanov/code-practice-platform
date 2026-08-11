const users = [
  { id: "u1", name: "Alice", age: 25 },
  { id: "u2", name: "Bob", age: 30 },
  { id: "u3", name: "Charlie", age: 35 },
];

const mapUsersById = (users) => {
  return users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});
};

// Пример вызова:
console.log(mapUsersById(users));
// {
//   u1: { id: "u1", name: "Alice", age: 25 },
//   u2: { id: "u2", name: "Bob", age: 30 },
//   u3: { id: "u3", name: "Charlie", age: 35 }
// }
