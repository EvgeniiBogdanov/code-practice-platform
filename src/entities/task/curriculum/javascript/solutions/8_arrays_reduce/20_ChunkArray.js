const chunk = (array, size = 1) => {
  if (!Array.isArray(array) || array.length === 0) {
    return [];
  }

  const chunkSize = Math.floor(Number(size));
  if (!Number.isFinite(chunkSize) || chunkSize <= 0) {
    return [];
  }

  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
};

// Пример вызова:
console.log(chunk([1, 2, 3, 4, 5], 2)); // [ [ 1, 2 ], [ 3, 4 ], [ 5 ] ]
console.log(chunk(["a", "b", "c", "d"], 3)); // [ [ 'a', 'b', 'c' ], [ 'd' ] ]
console.log(chunk([1, 2, 3], 1)); // [ [ 1 ], [ 2 ], [ 3 ] ]
console.log(chunk([1, 2, 3], 0)); // []
console.log(chunk([], 2)); // []
console.log(chunk(null, 2)); // []
