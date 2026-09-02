// Что выведет данный код в консоль и почему?

console.log("Start");

setTimeout(() => {
  console.log("Timeout 1");
  setTimeout(() => {
    console.log("Nested Timeout");
  }, 0);
}, 0);

setTimeout(() => {
  console.log("Timeout 2");
}, 0);

console.log("End");
