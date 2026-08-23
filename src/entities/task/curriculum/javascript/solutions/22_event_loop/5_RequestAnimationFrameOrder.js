console.log("A"); // A

setTimeout(() => {
  console.log("B"); // B
}, 0);

requestAnimationFrame(() => {
  console.log("C"); // C (фаза рендеринга)
});

Promise.resolve().then(() => {
  console.log("D"); // D (микрозадача)
});

console.log("E"); // E
// Порядок вывода: A, E, D, B, C
