const expandRanges = (ranges) => {
  if (ranges === "") {
    return [];
  }

  const result = [];

  for (const part of ranges.split(",")) {
    // Одиночное число даёт массив из одного элемента; тогда end берёт значение start
    const [start, end = start] = part.split("-").map(Number);

    for (let value = start; value <= end; value++) {
      result.push(value);
    }
  }

  return result;
};

// Пример вызова:
console.log(expandRanges("1-6,8-9,11")); // [1, 2, 3, 4, 5, 6, 8, 9, 11]
console.log(expandRanges("5"));          // [5]
console.log(expandRanges("0-2,10"));     // [0, 1, 2, 10]
console.log(expandRanges(""));           // []
