const findFirstEven = (arr) => {
  return arr.find((num) => num % 2 === 0);
};

// Пример вызова:
console.log(findFirstEven([1, 3, 7, 8, 10])); // 8
console.log(findFirstEven([1, 3, 5]));        // undefined
