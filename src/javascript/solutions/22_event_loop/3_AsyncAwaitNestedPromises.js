// Порядок вывода:
// 1, 6, 3, 5, 4, 2

console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
  return Promise.resolve('4');
}).then(console.log);

(async () => {
  console.log(await Promise.resolve('5'));
})();

console.log('6');
