const flatten = (arr) => {
  return arr.reduce((acc, el) => {
    acc.push(...el);
    return acc;
  }, []);
};

// Пример вызова:
console.log(flatten([[1, 2], [3, 4], [5]])); // [1, 2, 3, 4, 5]
console.log(flatten([["a", "b"], ["c"]]));   // ["a", "b", "c"]
console.log(flatten([]));                    // []
