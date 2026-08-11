console.log(1); // 1

const prom1 = new Promise((resolve) => {
  console.log(3); // 3
  return resolve(4);
});

console.log(2); // 2

prom1.then((resp) => {
  console.log(resp); // 4
});

(function () {
  console.log(5); // 5
})();
// Порядок вывода: 1, 3, 2, 5, 4
