const users = [
  { name: "John", active: true },
  { name: "Jane", active: false },
  { name: "Jack", active: true },
];

const filterActiveUsers = (arr, value) => arr.filter((user) => user.active === value);

const result = filterActiveUsers(users, true);
console.log(result);
