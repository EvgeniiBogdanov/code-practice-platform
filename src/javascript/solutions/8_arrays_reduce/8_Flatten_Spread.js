const flatten = (arr) => {
  return arr.reduce((acc, el) => {
    return [...acc, ...el];
  }, []);
};

// Пример вызова:
console.log(flatten([[1, 2], [3, 4], [5]])); // [1, 2, 3, 4, 5]
console.log(flatten([["a", "b"], ["c"]]));   // ["a", "b", "c"]
console.log(flatten([]));                    // []
