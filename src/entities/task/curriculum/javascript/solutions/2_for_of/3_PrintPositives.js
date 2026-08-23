const printPositives = (arr) => {
  for (const num of arr) {
    if (num > 0) {
      console.log(num);
    }
  }
};

// Пример вызова:
printPositives([-43, 32, -33, 6, -8, 80]);
// 32
// 6
// 80
