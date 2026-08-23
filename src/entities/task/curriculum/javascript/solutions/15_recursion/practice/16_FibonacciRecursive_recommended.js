const fib = (n) => {
  if (n <= 1) return n;
  let a = 0;
  let b = 1;

  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
};

// Пример вызова:
console.log(fib(3)); // 2
console.log(fib(7)); // 13
