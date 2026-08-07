const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jack" },
];

const findUserByName = (arr, name) => arr.find((user) => user.name === name);

const result = findUserByName(users, "Jane");
console.log(result);
