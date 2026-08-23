// Порядок выполнения в Event Loop (микрозадачи и макрозадачи)
// В каком порядке выведутся строки в консоль?

console.log("1: Main script start");

setTimeout(() => {
  console.log("2: setTimeout 1");
  Promise.resolve().then(() => {
    console.log("3: Promise inside setTimeout 1");
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log("4: Promise 1");
    return Promise.resolve();
  })
  .then(() => {
    console.log("5: Promise 2");
  });

setTimeout(() => {
  console.log("6: setTimeout 2");
}, 0);

Promise.resolve().then(() => {
  console.log("7: Promise 3");
});

console.log("8: Main script end");
