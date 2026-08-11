const checkEven = (numbers) => {
  return numbers.map((num) => num % 2 === 0);
};

// Пример вызова:
console.log(checkEven([1, 2, 3, 4, 5])); // [false, true, false, true, false]
