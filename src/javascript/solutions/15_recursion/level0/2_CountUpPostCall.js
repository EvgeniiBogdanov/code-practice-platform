const countUp = (n) => {
  if (n <= 0) return;
  countUp(n - 1);
  console.log(n); // выполняется при "возврате" из рекурсии
};

countUp(3);
