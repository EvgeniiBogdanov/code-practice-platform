const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jack" },
];

const findUserByName = (arr, targetName) =>
  arr.find(({ name }) => name === targetName);

console.log(findUserByName(users, "Jane")); // { id: 2, name: "Jane" }
