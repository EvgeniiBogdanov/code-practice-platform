const merge = (arr1, arr2) => {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
};

// Пример вызова:
console.log(merge([1, 3, 5], [2, 4, 6])); // [1, 2, 3, 4, 5, 6]
console.log(merge([1, 2], [3, 4, 5, 6])); // [1, 2, 3, 4, 5, 6]
console.log(merge([], [1, 2]));           // [1, 2]
