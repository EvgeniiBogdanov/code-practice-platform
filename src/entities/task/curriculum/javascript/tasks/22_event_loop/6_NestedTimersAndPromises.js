// Каков будет порядок вывода в консоль и почему?

setTimeout(() => {
  console.log("timer 1");
  Promise.resolve().then(() => console.log("promise in timer 1"));
}, 0);

Promise.resolve().then(() => {
  console.log("promise 1");
  setTimeout(() => console.log("timer in promise 1"), 0);
});

console.log("sync log");
