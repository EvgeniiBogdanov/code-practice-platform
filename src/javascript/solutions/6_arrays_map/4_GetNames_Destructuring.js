const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jack" },
];

const getNames = (arr) => arr.map(({ name }) => name);

console.log(getNames(users)); // ["John", "Jane", "Jack"]
