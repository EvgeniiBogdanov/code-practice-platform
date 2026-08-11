const createCounter = (initialValue = 0) => {
  let count = initialValue;
  return () => {
    count++;
    return count;
  };
};

// Пример вызова:
const counter = createCounter(0);
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
