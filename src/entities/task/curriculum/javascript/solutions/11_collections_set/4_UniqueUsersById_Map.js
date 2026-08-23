const users = [
  { id: 1, name: "Ann" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Ann 2" },
  { id: 3, name: "Kate" },
];

const getUniqueUsers = (users) => {
  const map = new Map();
  for (const user of users) {
    if (!map.has(user.id)) map.set(user.id, user);
  }
  return [...map.values()];
};

// Пример вызова:
console.log(getUniqueUsers(users));
