// Порядок вывода:
// A, E, D, B, C

console.log('A');

setTimeout(() => {
  console.log('B');
}, 0);

requestAnimationFrame(() => {
  console.log('C');
});

Promise.resolve().then(() => {
  console.log('D');
});

console.log('E');
