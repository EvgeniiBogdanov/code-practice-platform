// Порядок вывода:
// 3, 2, 5, 4, 1

setTimeout(() => {
  console.log(1);
});

const prom1 = new Promise((resolve) => {
  console.log(3);
  return resolve(4);
});

console.log(2);

prom1.then((resp) => {
  console.log(resp);
});

(function () {
  console.log(5);
})();
