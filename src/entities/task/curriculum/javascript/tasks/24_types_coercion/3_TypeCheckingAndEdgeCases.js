// Что выведет данный код в консоль?

console.log(NaN === NaN);
console.log(Object.is(NaN, NaN));
console.log(+0 === -0);
console.log(Object.is(+0, -0));
console.log(isNaN("hello"));
console.log(Number.isNaN("hello"));
console.log(0 || 42);
console.log(0 ?? 42);
console.log("" || "default");
console.log("" ?? "default");
console.log(typeof []);
console.log(Array.isArray([]));
console.log(Object.prototype.toString.call(null));
