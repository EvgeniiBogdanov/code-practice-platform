const words = ["apple", "dog", "banana", "cat"];

const filterWordsWithLetter = (arr, letter) =>
  arr.filter((word) => word.includes(letter));

const result = filterWordsWithLetter(words, "a");
console.log(result);
