function rearrangeArray(arr) {
  const evens = arr.filter((x) => x % 2 === 0).sort((a, b) => a - b);
  const odds = arr.filter((x) => x % 2 !== 0).sort((a, b) => a - b);

  return [...evens, ...odds];
}

console.log(rearrangeArray([5, 3, 2, 8, 1, 4]));
// [2, 4, 8, 1, 3, 5]

console.log(rearrangeArray([-1, 0, -5, 7, 2]));
// [0, 2, -5, -1, 7]

console.log(rearrangeArray([]));
// []
