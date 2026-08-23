const filterWordsWithLetter = (words, letter) => {
  return words.filter((word) => word.includes(letter));
};

// Пример вызова:
console.log(filterWordsWithLetter(["apple", "banana", "cherry", "date"], "a")); // ["apple", "banana", "date"]
