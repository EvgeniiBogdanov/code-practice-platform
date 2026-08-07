const unique = (arr) => {
  return arr.reduce((acc, item) => {
    if (!acc.includes(item)) {
      acc.push(item);
    }

    return acc;
  }, []);
};

console.log(unique([1, 2, 1, 3, 2, 4]));
console.log(unique(["a", "b", "a", "a", "c"]));
