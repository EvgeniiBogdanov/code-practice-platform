// Что покажет консоль при выполнении данного кода в браузере?

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
