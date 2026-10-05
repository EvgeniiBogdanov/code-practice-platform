Array.prototype.myFlat = function (depth = 1) {
  const result = [];

  const flatten = (arr, currentDepth) => {
    for (let i = 0; i < arr.length; i++) {
      // Пропускаем «дыры»: индекса нет в массиве
      if (!(i in arr)) {
        continue;
      }

      const item = arr[i];
      if (Array.isArray(item) && currentDepth > 0) {
        flatten(item, currentDepth - 1);
      } else {
        result.push(item);
      }
    }
  };

  // this — массив, на котором вызван метод
  flatten(this, depth);
  return result;
};

// Пример вызова:
const nested = [1, [2, [3, [4]]], 5];
console.log(nested.myFlat()); // [1, 2, [3, [4]], 5]
console.log(nested.myFlat(2)); // [1, 2, 3, [4], 5]
console.log(nested.myFlat(Infinity)); // [1, 2, 3, 4, 5]
console.log(nested.myFlat(0)); // [1, [2, [3, [4]]], 5]
console.log([1, , 3, [4, , 6]].myFlat()); // [1, 3, 4, 6]
console.log(nested); // [1, [2, [3, [4]]], 5]
