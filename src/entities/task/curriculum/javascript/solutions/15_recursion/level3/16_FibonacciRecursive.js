const fib = (n) => {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
};

// Пример вызова:
console.log(fib(3)); // 2
console.log(fib(7)); // 13
