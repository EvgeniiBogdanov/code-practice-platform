const users = [
  { name: "John", age: 25 },
  { name: "Jane", age: 20 },
  { name: "Jack", age: 30 },
];

const sortByAgeToSorted = (arr) => arr.toSorted((a, b) => a.age - b.age);

// Пример вызова:
console.log(sortByAgeToSorted(users));
