console.log("1"); // 1

setTimeout(() => {
  console.log("2"); // 2
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // 3
  return Promise.resolve("4");
}).then(console.log); // 4

(async () => {
  console.log(await Promise.resolve("5")); // 5
})();

console.log("6"); // 6
// Порядок вывода: 1, 6, 3, 5, 4, 2
