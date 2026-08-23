const countDown = (n) => {
  if (n <= 0) return;
  console.log(n);
  countDown(n - 1);
};

// Пример вызова:
countDown(3);
// 3
// 2
// 1
