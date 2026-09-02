// Что произойдет при выполнении рекурсивных микротасок?

console.log("Start");

function scheduleMicrotasks(count) {
  if (count <= 0) return;
  Promise.resolve().then(() => {
    console.log("Microtask:", count);
    scheduleMicrotasks(count - 1);
  });
}

setTimeout(() => console.log("Macrotask fired"), 0);

scheduleMicrotasks(3);
console.log("End");
