async function async1() {
  console.log("async1 start"); // 2 — тело async-функции до первого await выполняется синхронно
  await async2();
  console.log("async1 end"); // 6 — продолжение после await — это микрозадача
}

async function async2() {
  console.log("async2"); // 3 — вызывается синхронно
}

console.log("script start"); // 1

setTimeout(() => {
  console.log("setTimeout"); // 8 — макрозадача: после всех микрозадач
}, 0);

async1();

new Promise((resolve) => {
  console.log("promise1"); // 4 — executor выполняется синхронно
  resolve();
}).then(() => {
  console.log("promise2"); // 7 — микрозадача, поставлена в очередь после async1
});

console.log("script end"); // 5

// Итог: script start, async1 start, async2, promise1, script end,
//       async1 end, promise2, setTimeout
