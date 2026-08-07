const users = [
  { name: "John", age: 25 },
  { name: "Jane", age: 20 },
  { name: "Jack", age: 30 },
];

const sortByAge = (arr) => arr.sort((a, b) => a.age - b.age);

const result = sortByAge(users);
console.log(result);
