const sortReverseAlphabetically = (words) => {
  return [...words].sort((a, b) => b.localeCompare(a));
};

// Пример вызова:
console.log(sortReverseAlphabetically(["banana", "apple", "cherry", "date"])); // ["date", "cherry", "banana", "apple"]
