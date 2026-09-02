// Что выведет данный код в консоль и почему?

const numbers = [10, 20, 30];

const result = numbers.reduce((acc, curr) => {
  console.log(`acc: ${acc}, curr: ${curr}`);
  return acc + curr;
});

console.log("Result:", result);
