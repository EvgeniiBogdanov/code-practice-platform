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
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])); // [1, 1, 4, 2, 1, 1, 0, 0]
console.log(dailyTemperatures([30, 40, 50, 60]));                 // [1, 1, 1, 0]
console.log(dailyTemperatures([30, 60, 90]));                     // [1, 1, 0]
