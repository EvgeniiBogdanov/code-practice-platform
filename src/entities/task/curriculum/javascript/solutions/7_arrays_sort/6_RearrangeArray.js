const rearrangeArray = (arr) => {
  const evens = arr.filter((n) => n % 2 === 0).sort((a, b) => a - b);
  const odds = arr.filter((n) => n % 2 !== 0).sort((a, b) => a - b);
  return [...evens, ...odds];
};

// Пример вызова:
console.log(rearrangeArray([5, 3, 2, 8, 1, 4])); // [2, 4, 8, 1, 3, 5]
