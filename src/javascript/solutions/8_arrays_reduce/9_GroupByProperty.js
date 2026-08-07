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

console.log(groupBy(people, "age"));
