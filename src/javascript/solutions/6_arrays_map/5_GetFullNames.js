const users = [
  { firstName: "John", lastName: "Doe" },
  { firstName: "Jane", lastName: "Smith" },
];

const getFullNames = (arr) =>
  arr.map((user) => `${user.firstName} ${user.lastName}`);

const result = getFullNames(users);
console.log(result);
