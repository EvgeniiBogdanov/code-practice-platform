const flatten = (arr) => {
  const result = [];

  for (const el of arr) {
    if (Array.isArray(el)) result.push(...flatten(el));
    else result.push(el);
  }

  return result;
};

// Пример вызова:
console.log(flatten([1, [2, [3, [4, 5]], 6]])); // [1, 2, 3, 4, 5, 6]
