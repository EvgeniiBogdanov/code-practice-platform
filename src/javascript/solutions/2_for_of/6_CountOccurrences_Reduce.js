// Вариант 2: Через метод reduce()
const arr = ["кофе", "сок", "газировка", "вода", "кофе", "кофе"];

const countOccurrences = (array, word) =>
  array.reduce((count, item) => (item === word ? count + 1 : count), 0);

console.log(countOccurrences(arr, "кофе")); // 3
