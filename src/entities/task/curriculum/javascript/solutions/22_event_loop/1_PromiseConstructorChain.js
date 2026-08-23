console.log(1); // 1

setTimeout(() => {
  console.log(2); // 2
}, 0);

new Promise((resolve) => {
  console.log(3); // 3
  resolve();
}).then(() => {
  console.log(4); // 4
});

console.log(5); // 5
// Порядок вывода: 1, 3, 5, 4, 2
