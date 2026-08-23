const getUniqueWords = (text) => {
  return [...new Set(text.split(" "))];
};

// Пример вызова:
console.log(getUniqueWords("hello world hello set world")); // ["hello", "world", "set"]
