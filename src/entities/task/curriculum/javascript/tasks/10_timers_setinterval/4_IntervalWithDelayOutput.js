// Каков будет порядок вывода в консоль и почему?

console.log("Start");
console.log("End");

setTimeout(() => {
  console.log("Timeout");
}, 500);

setInterval(() => {
  console.log("Interval");
}, 1000);
