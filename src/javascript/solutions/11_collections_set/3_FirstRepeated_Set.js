const firstRepeated = (arr) => {
  const unique = new Set();

  for (const el of arr) {
    if (unique.has(el)) return el;
    unique.add(el);
  }

  return null;
};

console.log(firstRepeated([1, 2, 3, 2, 1])); // 2
console.log(firstRepeated([1, 2, 3]));       // null
