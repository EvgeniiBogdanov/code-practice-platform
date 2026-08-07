const people = [
  { age: 20, name: "Alice" },
  { age: 30, name: "Brat" },
  { age: 20, name: "Sem" },
];

const groupByNative = (arr, key) => Object.groupBy(arr, (item) => item[key]);

console.log(groupByNative(people, "age"));
