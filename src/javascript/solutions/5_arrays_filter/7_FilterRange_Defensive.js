const numbers = [10, 25, 40, 60, 5, 70];

const filterRangeDefensive = (arr, a, b) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return arr.filter((num) => num >= lower && num <= upper);
};

console.log(filterRangeDefensive(numbers, 50, 20)); // [25, 40]
