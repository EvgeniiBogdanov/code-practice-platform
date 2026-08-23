const sortAlphabetically = (words) => {
  return [...words].sort((a, b) => a.localeCompare(b));
};

// Пример вызова:
console.log(sortAlphabetically(["banana", "apple", "cherry", "date"])); // ["apple", "banana", "cherry", "date"]
