const filterByLength = (arr, n) => {
  const result = [];
  for (const str of arr) {
    if (str.length > n) {
      result.push(str);
    }
  }
  return result;
};

// Пример вызова:
console.log(filterByLength(["кофе", "сок", "газировка", "вода"], 4)); // ["газировка"]
console.log(filterByLength(["кофе", "сок", "газировка", "вода"], 3)); // ["кофе", "газировка", "вода"]
