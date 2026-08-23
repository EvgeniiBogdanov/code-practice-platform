const countUp = (n) => {
  if (n <= 0) return;
  countUp(n - 1);
  console.log(n);
};

// Пример вызова:
countUp(3);
// 1
// 2
// 3
