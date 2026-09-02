// Каков будет порядок вывода в консоль при монтировании компонента?

console.log("Render start");

Promise.resolve().then(() => console.log("Microtask after render"));

setTimeout(() => console.log("Macrotask"), 0);

console.log("Render complete");
