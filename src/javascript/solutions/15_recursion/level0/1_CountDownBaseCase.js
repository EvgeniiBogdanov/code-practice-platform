const countDown = (n) => {
  if (n <= 0) return; // база рекурсии — точка остановки
  console.log(n);
  countDown(n - 1); // рекурсивный вызов с уменьшением аргумента
};

countDown(3);
