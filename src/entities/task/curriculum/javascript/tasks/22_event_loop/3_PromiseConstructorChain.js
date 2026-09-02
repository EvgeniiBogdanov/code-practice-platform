// Каков будет порядок вывода в консоль и почему?

console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

new Promise((resolve) => {
  console.log("3");
  resolve();
})
  .then(() => {
    console.log("4");
  })
  .then(() => {
    console.log("5");
  });

console.log("6");
