const findMax = (arr) => {
  if (arr.length === 1) return arr[0];
  const maxOfRest = findMax(arr.slice(1));
  return arr[0] > maxOfRest ? arr[0] : maxOfRest;
};

// Пример вызова:
console.log(findMax([3, 7, 2, 9, 4])); // 9
