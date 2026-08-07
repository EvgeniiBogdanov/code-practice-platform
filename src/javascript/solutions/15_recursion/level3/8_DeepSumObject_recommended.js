const deepSum = (obj) => {
  if (typeof obj === 'number') return obj;
  if (obj === null || typeof obj !== 'object') return 0;
  return Object.values(obj).reduce((sum, val) => sum + deepSum(val), 0);
};

console.log(deepSum({ a: 1, b: { c: 2, d: { e: 3 } }, f: [4, 5] })); // 15
