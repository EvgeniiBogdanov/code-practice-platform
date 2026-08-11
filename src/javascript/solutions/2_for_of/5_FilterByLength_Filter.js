const filterByLength = (arr, n) => {
  return arr.filter((str) => str.length > n);
};

// Пример вызова:
console.log(filterByLength(["кофе", "сок", "газировка", "вода"], 4)); // ["газировка"]
console.log(filterByLength(["кофе", "сок", "газировка", "вода"], 3)); // ["кофе", "газировка", "вода"]
