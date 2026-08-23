const users = [
  { name: "Анна", age: 17 },
  { name: "Иван", age: 22 },
  { name: "Мария", age: 18 },
  { name: "Пётр", age: 15 },
];

const filterAdults = (users) => {
  return users.filter((user) => user.age >= 18);
};

// Пример вызова:
console.log(filterAdults(users));
// [
//   { name: "Иван", age: 22 },
//   { name: "Мария", age: 18 }
// ]
