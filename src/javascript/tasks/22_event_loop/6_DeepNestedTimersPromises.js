// Глубоко вложенные таймеры и промисы
// Что покажет консоль при выполнении данного кода?

console.log("begins");

setTimeout(() => {
  console.log("setTimeout 1");
  Promise.resolve().then(() => {
    console.log("promise 1");
  });
}, 0);

new Promise((resolve) => {
  console.log("promise 2");
  setTimeout(() => {
    console.log("setTimeout 2");
    resolve("resolve 1");
  }, 0);
}).then((res) => {
  console.log("dot then 1");
  setTimeout(() => {
    console.log(res);
  }, 0);
});
