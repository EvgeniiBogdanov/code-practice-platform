const filterRange = (numbers, min, max) => {
  return numbers.filter((num) => num >= min && num <= max);
};

// Пример вызова:
console.log(filterRange([10, 25, 30, 55, 40, 5], 20, 50)); // [25, 30, 40]
