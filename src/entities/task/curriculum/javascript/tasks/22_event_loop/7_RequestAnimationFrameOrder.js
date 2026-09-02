// Каков будет порядок выполнения в цикле событий браузера?

console.log("start");

setTimeout(() => console.log("setTimeout 0"), 0);

Promise.resolve().then(() => console.log("microtask"));

console.log("end");
