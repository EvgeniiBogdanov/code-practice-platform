const arrayNumbers = [-43, 32, -33, 6, -8, 80];

const printPositiveNumbers = (arr) => {
  for (const num of arr) {
    if (num > 0) {
      console.log(num);
    }
  }
};

printPositiveNumbers(arrayNumbers);
