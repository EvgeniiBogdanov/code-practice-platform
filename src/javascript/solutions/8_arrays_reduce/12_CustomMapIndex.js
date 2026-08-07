const items = [
  { id: 1, name: "A", price: 100 },
  { id: 2, name: "B", price: 200 },
  { id: 3, name: "C", price: 300 },
];

const customMap = (arr) => {
  return arr.reduce((acc, { id, name }) => {
    acc[id] = { id, name };

    return acc;
  }, {});
};

console.log(customMap(items));
