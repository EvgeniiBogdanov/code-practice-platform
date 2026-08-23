const hasElemFrom = (arr, target, fromIndex) => {
  return arr.includes(target, fromIndex);
};

// Пример вызова:
console.log(hasElemFrom([1, 2, 3, 4, 5], 3, 2)); // true
console.log(hasElemFrom([1, 2, 3, 4, 5], 3, 3)); // false
