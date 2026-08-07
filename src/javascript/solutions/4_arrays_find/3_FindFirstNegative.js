const numbers = [5, 7, 3, -2, -8, 4];

const findFirstNegative = (arr) => arr.find((num) => num < 0);

const result = findFirstNegative(numbers);
console.log(result);
