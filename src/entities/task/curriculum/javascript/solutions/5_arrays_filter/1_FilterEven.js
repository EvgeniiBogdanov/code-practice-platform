const filterEven = (numbers) => {
  return numbers.filter((num) => num % 2 === 0);
};

// Пример вызова:
console.log(filterEven([1, 2, 3, 4, 5, 6])); // [2, 4, 6]
