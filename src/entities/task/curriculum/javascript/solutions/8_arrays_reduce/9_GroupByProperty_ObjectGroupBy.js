const people = [
  { age: 20, name: "Alice" },
  { age: 30, name: "Brat" },
  { age: 20, name: "Sem" },
];

const groupBy = (arr, key) => Object.groupBy(arr, (item) => item[key]);

// Пример вызова:
console.log(groupBy(people, "age"));
