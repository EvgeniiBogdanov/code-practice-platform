const deepSum = (obj) => {
  let sum = 0;

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const value = obj[key];

      if (typeof value === "number") sum += value;
      if (typeof value === "object" && value !== null) sum += deepSum(value);
    }
  }

  return sum;
};

// Пример вызова:
console.log(deepSum({ a: 1, b: { c: 2, d: { e: 3 } }, f: [4, 5] })); // 15
