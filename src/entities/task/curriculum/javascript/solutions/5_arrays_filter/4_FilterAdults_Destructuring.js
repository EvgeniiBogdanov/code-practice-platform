const users = [
  { name: "John", age: 17 },
  { name: "Jane", age: 20 },
  { name: "Jack", age: 15 },
  { name: "Jill", age: 25 },
];

const filterAdults = (arr, minAge) => arr.filter(({ age }) => age >= minAge);

// Пример вызова:
console.log(filterAdults(users, 18));
// [{ name: "Jane", age: 20 }, { name: "Jill", age: 25 }]
