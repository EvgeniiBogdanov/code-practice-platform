const factorial = (n) => {
  if (n === 0 || n === 1) return 1; // база
  return n * factorial(n - 1); // рекурсивный шаг
};

console.log(factorial(5));
