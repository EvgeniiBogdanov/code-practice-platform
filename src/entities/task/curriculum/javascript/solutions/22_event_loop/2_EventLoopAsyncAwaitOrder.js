console.log("1: Script start"); // 1: Script start

async function async1() {
  console.log("2: async1 start"); // 2: async1 start
  await async2();
  console.log("3: async1 end"); // 3: async1 end
}

async function async2() {
  console.log("4: async2"); // 4: async2
}

async1();

setTimeout(() => {
  console.log("5: setTimeout"); // 5: setTimeout
}, 0);

Promise.resolve().then(() => {
  console.log("6: promise 1"); // 6: promise 1
});

console.log("7: Script end"); // 7: Script end
// Порядок вывода: 1, 2, 4, 7, 3, 6, 5
