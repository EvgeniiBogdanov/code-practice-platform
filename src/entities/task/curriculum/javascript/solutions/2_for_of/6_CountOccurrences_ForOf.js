const countOccurrences = (arr, word) => {
  let count = 0;
  for (const item of arr) {
    if (item === word) {
      count++;
    }
  }
  return count;
};

// Пример вызова:
console.log(countOccurrences(["кофе", "сок", "газировка", "вода", "кофе", "кофе"], "кофе")); // 3
console.log(countOccurrences(["кофе", "сок", "газировка", "вода"], "чай"));                   // 0
