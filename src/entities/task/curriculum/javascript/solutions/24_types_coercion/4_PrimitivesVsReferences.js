// 7 примитивных типов + object
console.log(typeof 42); // "number"
console.log(typeof "текст"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof 10n); // "bigint"
console.log(typeof Symbol("id")); // "symbol"
console.log(typeof null); // "object" — исторический баг языка
console.log(typeof {}); // "object"
console.log(typeof []); // "object" — массив тоже объект
console.log(typeof function () {}); // "function" — особый случай объекта

// Примитивы копируются по значению
let a = 10;
let b = a;
b = 20;
console.log(a); // 10

// Объекты копируются по ссылке: first и second указывают на один объект
const first = { value: 10 };
const second = first;
second.value = 20;
console.log(first.value); // 20

console.log({ x: 1 } === { x: 1 }); // false — два разных объекта
console.log(first === second); // true — одна и та же ссылка

function changePrimitive(n) {
  n = 100; // меняется локальная копия
}
function changeObject(obj) {
  obj.value = 100; // мутация объекта по полученной ссылке
}
function replaceObject(obj) {
  obj = { value: 500 }; // переприсваивание локальной переменной, оригинал не трогаем
}

let num = 1;
changePrimitive(num);
console.log(num); // 1

changeObject(first);
console.log(first.value); // 100

replaceObject(first);
console.log(first.value); // 100
