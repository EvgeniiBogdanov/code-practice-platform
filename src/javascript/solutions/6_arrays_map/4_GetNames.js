const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jack" },
];

const getNames = (arr) => arr.map((user) => user.name);

const result = getNames(users);
console.log(result);
