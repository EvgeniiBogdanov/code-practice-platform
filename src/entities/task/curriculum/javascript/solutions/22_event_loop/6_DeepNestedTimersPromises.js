console.log("begins"); // begins

setTimeout(() => {
  console.log("setTimeout 1"); // setTimeout 1
  Promise.resolve().then(() => {
    console.log("promise 1"); // promise 1
  });
}, 0);

new Promise((resolve) => {
  console.log("promise 2"); // promise 2
  setTimeout(() => {
    console.log("setTimeout 2"); // setTimeout 2
    resolve("resolve 1");
  }, 0);
}).then((res) => {
  console.log("dot then 1"); // dot then 1
  setTimeout(() => {
    console.log(res); // resolve 1
  }, 0);
});
// Порядок вывода: begins, promise 2, setTimeout 1, promise 1, setTimeout 2, dot then 1, resolve 1
