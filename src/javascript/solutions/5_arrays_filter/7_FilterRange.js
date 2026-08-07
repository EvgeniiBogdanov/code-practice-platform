const numbers = [10, 25, 40, 60, 5, 70];

const filterRange = (arr, min, max) =>
  arr.filter((num) => num >= min && num <= max);

const result = filterRange(numbers, 20, 50);
console.log(result);
