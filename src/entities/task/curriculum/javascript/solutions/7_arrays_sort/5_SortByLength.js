const sortByLength = (words) => {
  return [...words].sort((a, b) => a.length - b.length);
};

// Пример вызова:
console.log(sortByLength(["elephant", "cat", "dog", "hippopotamus"])); // ["cat", "dog", "elephant", "hippopotamus"]
