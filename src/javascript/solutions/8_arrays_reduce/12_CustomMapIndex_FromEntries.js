const items = [
  { id: 1, name: "A", price: 100 },
  { id: 2, name: "B", price: 200 },
  { id: 3, name: "C", price: 300 },
];

const customMapFromEntries = (arr) =>
  Object.fromEntries(arr.map(({ id, name }) => [id, { id, name }]));

// Пример вызова:
console.log(customMapFromEntries(items));
