const dailyTemperatures = (temperatures) => {
  const result = new Array(temperatures.length).fill(0);
  const stack = [];

  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length > 0) {
      const lastIndex = stack[stack.length - 1];
      const isWarmer = temperatures[i] > temperatures[lastIndex];

      if (isWarmer) {
        const prevIndex = stack.pop();
        result[prevIndex] = i - prevIndex;
      }

      if (!isWarmer) break;
    }

    stack.push(i);
  }

  return result;
};

// Пример вызова:
console.log(dailyTemperatures([18, 16, 20, 15, 17, 21])); // [2, 1, 3, 1, 1, 0]
console.log(dailyTemperatures([25, 24, 23]));             // [0, 0, 0]
console.log(dailyTemperatures([10, 12]));                 // [1, 0]
