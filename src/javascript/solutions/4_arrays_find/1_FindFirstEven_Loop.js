const numbers = [1, 3, 7, 8, 10];

const findFirstEvenLoop = (arr) => {
  for (const num of arr) {
    if (num % 2 === 0) return num;
  }
  return undefined;
};

console.log(findFirstEvenLoop(numbers)); // 8
