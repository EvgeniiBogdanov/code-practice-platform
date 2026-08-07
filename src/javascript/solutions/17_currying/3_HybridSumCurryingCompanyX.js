const sum = (a, b) => {
  if (b === undefined) {
    return (num) => a + num;
  }

  return a + b;
};

console.log(sum(1, 2)); // 3
console.log(sum(1)(2)); // 3
console.log(sum(5)(10)); // 15
