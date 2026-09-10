const firstRepeated = (arr) => {
  const unique = new Set();

  for (const el of arr) {
    if (unique.has(el)) return el;
    unique.add(el);
  }

  return undefined;
};

// Пример вызова:
console.log(firstRepeated([2, 5, 1, 2, 3, 5, 1])); // 2
console.log(firstRepeated([2, 1, 3, 5, 3, 2]));    // 3
console.log(firstRepeated([1, 2, 3, 4]));          // undefined
