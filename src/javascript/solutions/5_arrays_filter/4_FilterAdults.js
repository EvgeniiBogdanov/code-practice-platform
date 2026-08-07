const users = [
  { name: "John", age: 17 },
  { name: "Jane", age: 20 },
  { name: "Jack", age: 15 },
  { name: "Jill", age: 25 },
];

const filterAdults = (arr, minAge) => arr.filter((user) => user.age >= minAge);

const result = filterAdults(users, 18);
console.log(result);
