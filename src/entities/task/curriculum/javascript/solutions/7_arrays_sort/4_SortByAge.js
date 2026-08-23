const users = [
  { name: "Анна", age: 25 },
  { name: "Иван", age: 20 },
  { name: "Мария", age: 30 },
];

const sortByAge = (users) => {
  return [...users].sort((a, b) => a.age - b.age);
};

// Пример вызова:
console.log(sortByAge(users));
// [
//   { name: "Иван", age: 20 },
//   { name: "Анна", age: 25 },
//   { name: "Мария", age: 30 }
// ]
