const sum = (a) => {
  if (a === undefined) return 0;
  return (b) => {
    if (b === undefined) return a;
    return sum(a + b);
  };
};

// Пример вызова:
console.log(sum(1)(2)(3)()); // 6
console.log(sum(5)(-2)());   // 3
