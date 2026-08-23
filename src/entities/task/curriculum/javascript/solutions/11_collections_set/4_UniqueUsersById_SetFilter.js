const users = [
  { id: 1, name: "Ann" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Ann 2" },
  { id: 3, name: "Kate" },
];

const getUniqueUsers = (users) => {
  const seenIds = new Set();
  return users.filter((user) => {
    if (seenIds.has(user.id)) return false;
    seenIds.add(user.id);
    return true;
  });
};

// Пример вызова:
console.log(getUniqueUsers(users));
