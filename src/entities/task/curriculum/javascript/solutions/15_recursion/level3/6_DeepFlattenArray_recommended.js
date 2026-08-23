const flatten = (arr) => arr.flat(Infinity);

// Пример вызова:
console.log(flatten([1, [2, [3, [4, 5]], 6]])); // [1, 2, 3, 4, 5, 6]
