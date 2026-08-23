const people = [
  { age: 20, name: "Alice" },
  { age: 30, name: "Brat" },
  { age: 20, name: "Sem" },
];

const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const groupKey = item[key];
    acc[groupKey] ??= [];
    acc[groupKey].push(item);
    return acc;
  }, {});
};

// Пример вызова:
console.log(groupBy(people, "age"));
// {
//   "20": [{ age: 20, name: "Alice" }, { age: 20, name: "Sem" }],
//   "30": [{ age: 30, name: "Brat" }]
// }
