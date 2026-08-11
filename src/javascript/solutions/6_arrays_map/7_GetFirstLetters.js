const getFirstLetters = (words) => {
  return words.map((word) => word[0]);
};

// Пример вызова:
console.log(getFirstLetters(["Hello", "World", "JavaScript"])); // ["H", "W", "J"]
