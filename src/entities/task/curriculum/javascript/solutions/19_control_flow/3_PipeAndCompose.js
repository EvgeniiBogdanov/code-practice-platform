const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

const add2 = (x) => x + 2;
const mult3 = (x) => x * 3;

// Пример вызова:
console.log(pipe(add2, mult3)(5));    // 21
console.log(compose(mult3, add2)(5)); // 21
