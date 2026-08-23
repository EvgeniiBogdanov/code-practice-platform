const power = (base, exp) => {
  if (exp === 0) return 1;
  return base * power(base, exp - 1);
};

// Пример вызова:
console.log(power(2, 5)); // 32
console.log(power(3, 3)); // 27
