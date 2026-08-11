const unique = (arr) => {
  return arr.reduce((acc, item) => {
    if (!acc.includes(item)) {
      acc.push(item);
    }
    return acc;
  }, []);
};

// Пример вызова:
console.log(unique([1, 2, 2, 3, 4, 4, 5, 1])); // [1, 2, 3, 4, 5]
