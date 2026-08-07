const flatten = (arr) => {
  const result = [];

  for (const el of arr) {
    if (Array.isArray(el)) result.push(...flatten(el));
    if (!Array.isArray(el)) result.push(el);
  }

  return result;
};

console.log(flatten([1, [2, [3, [4, 5]], 6]]));
