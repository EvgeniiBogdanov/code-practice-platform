const numbers = [5, 2, 9, 1, 7];

const sortAscendingToSorted = (arr) => arr.toSorted((a, b) => a - b);

console.log(sortAscendingToSorted(numbers)); // [1, 2, 5, 7, 9]
