// Каков будет порядок вывода в консоль и почему?

console.log("start");

(function () {
  console.log("iife");
})();

Promise.resolve().then(() => console.log("promise"));

console.log("end");
