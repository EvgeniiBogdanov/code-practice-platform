const countOccurrences = (arr) => {
  return arr.reduce((acc, el) => {
    acc.set(el, (acc.get(el) || 0) + 1);
    return acc;
  }, new Map());
};

// Пример вызова:
console.log(countOccurrences(["a", "b", "a", "c", "b", "a"]));
