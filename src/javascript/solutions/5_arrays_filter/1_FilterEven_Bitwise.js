const numbers = [1, 2, 3, 4, 5, 6];

const filterEvenBitwise = (arr) => arr.filter((num) => (num & 1) === 0);

// Пример вызова:
console.log(filterEvenBitwise(numbers)); // [2, 4, 6]
