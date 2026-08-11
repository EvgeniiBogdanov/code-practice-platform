const findFirstNegative = (arr) => {
  return arr.find((num) => num < 0);
};

// Пример вызова:
console.log(findFirstNegative([4, 6, -2, 8, -5])); // -2
console.log(findFirstNegative([1, 2, 3]));         // undefined
