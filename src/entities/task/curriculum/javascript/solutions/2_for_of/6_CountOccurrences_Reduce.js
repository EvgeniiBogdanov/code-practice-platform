const countOccurrences = (arr, word) => {
  return arr.reduce((count, item) => (item === word ? count + 1 : count), 0);
};

// Пример вызова:
console.log(countOccurrences(["кофе", "сок", "газировка", "вода", "кофе", "кофе"], "кофе")); // 3
console.log(countOccurrences(["кофе", "сок", "газировка", "вода"], "чай"));                   // 0
