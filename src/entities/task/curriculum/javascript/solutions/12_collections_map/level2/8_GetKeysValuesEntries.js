const products = new Map([
  ["bread", 50],
  ["milk", 80],
  ["eggs", 120],
]);

const keysArr = [...products.keys()];
const valuesArr = [...products.values()];
const entriesArr = [...products.entries()];

console.log(keysArr);    // ["bread", "milk", "eggs"]
console.log(valuesArr);  // [50, 80, 120]
console.log(entriesArr); // [["bread",50], ["milk",80], ["eggs",120]]
