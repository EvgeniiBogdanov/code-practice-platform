const obj = {
  a: 1,
  b: {
    c: 3,
    d: -10,
    e: {
      f: {
        g: 1,
      },
    },
  },
};

const sumNumbers = (data) => {
  let sum = 0;

  for (const key in data) {
    const value = data[key];

    if (typeof value === "number") {
      sum += value;
    } else if (typeof value === "object" && value !== null) {
      sum += sumNumbers(value);
    }
  }

  return sum;
};

// Пример вызова:
console.log(sumNumbers(obj)); // -5
