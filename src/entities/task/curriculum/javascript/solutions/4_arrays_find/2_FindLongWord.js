const findLongWord = (words, minLength) => {
  return words.find((word) => word.length > minLength);
};

// Пример вызова:
console.log(findLongWord(["cat", "elephant", "dog", "tiger"], 4)); // "elephant"
console.log(findLongWord(["cat", "dog"], 4));                      // undefined
