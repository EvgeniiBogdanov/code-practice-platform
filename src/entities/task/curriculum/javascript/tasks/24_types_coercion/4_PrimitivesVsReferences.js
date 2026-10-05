// Что выведет данный код в консоль и почему?

console.log(typeof 42);
console.log(typeof "текст");
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof 10n);
console.log(typeof Symbol("id"));
console.log(typeof null);
console.log(typeof {});
console.log(typeof []);
console.log(typeof function () {});

let a = 10;
let b = a;
b = 20;
console.log(a);

const first = { value: 10 };
const second = first;
second.value = 20;
console.log(first.value);

console.log({ x: 1 } === { x: 1 });
console.log(first === second);

function changePrimitive(n) {
  n = 100;
}
function changeObject(obj) {
  obj.value = 100;
}
function replaceObject(obj) {
  obj = { value: 500 };
}

let num = 1;
changePrimitive(num);
console.log(num);

changeObject(first);
console.log(first.value);

replaceObject(first);
console.log(first.value);
