const filterLongWords = (words) => {
  return words.filter((word) => word.length > 3);
};

// Пример вызова:
console.log(filterLongWords(["cat", "elephant", "dog", "tiger"])); // ["elephant", "tiger"]
