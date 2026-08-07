const numbers = [1, 3, 7, 8, 10];

const findFirstEven = (arr) => arr.find((num) => num % 2 === 0);

const result = findFirstEven(numbers);
console.log(result);
