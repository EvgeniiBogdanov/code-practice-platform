const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }

  return x;
};

// Пример вызова:
console.log(gcd(48, 18)); // 6
console.log(gcd(101, 10)); // 1
console.log(gcd(56, 98));  // 14
