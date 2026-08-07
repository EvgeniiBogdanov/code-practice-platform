const numbers = [5, 2, 9, 1, 7];

const sortAscending = (arr) => arr.sort((a, b) => a - b);

const result = sortAscending(numbers);
console.log(result); // [1, 2, 5, 7, 9]
