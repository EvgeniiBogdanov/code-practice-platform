const users = [
  { name: "Анна", age: 25 },
  { name: "Иван", age: 30 },
  { name: "Мария", age: 20 },
];

const getNames = (users) => {
  return users.map((user) => user.name);
};

// Пример вызова:
console.log(getNames(users)); // ["Анна", "Иван", "Мария"]
