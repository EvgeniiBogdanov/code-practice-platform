const generateBinaryStrings = (n) => {
  const result = [];

  const backtrack = (current) => {
    if (current.length === n) {
      result.push(current);
      return;
    }

    backtrack(`${current}0`);
    backtrack(`${current}1`);
  };

  backtrack("");
  return result;
};

// Пример вызова:
console.log(generateBinaryStrings(2)); // ["00", "01", "10", "11"]
console.log(generateBinaryStrings(1)); // ["0", "1"]
console.log(generateBinaryStrings(0)); // [""]
