// Каков будет порядок вывода в консоль и почему?

console.log("Start");

setInterval(() => {
  console.log("Interval");
}, 1000);

setTimeout(() => {
  console.log("Timeout");
}, 500);

console.log("End");
