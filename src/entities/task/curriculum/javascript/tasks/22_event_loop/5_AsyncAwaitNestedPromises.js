// Каков будет порядок вывода в консоль и почему?

async function f1() {
  console.log("f1 start");
  await f2();
  console.log("f1 end");
}

async function f2() {
  console.log("f2");
}

console.log("global start");
f1();
console.log("global end");
