// Неизменяемый diff и patch объектов
// Реализуйте функции diffObjects(baseObj, targetObj) и patchObject(baseObj, diff).
// Исходные объекты не должны мутироваться.

const diffObjects = (baseObj, targetObj) => {
  // Решение тут
};

const patchObject = (baseObj, diff) => {
  // Решение тут
};

// Пример вызова:
const initial = { a: 1, b: 2, c: 3 };
const updated = { b: 20, c: 3, d: 4 };

const diff = diffObjects(initial, updated);
console.log(diff);
// { added: { d: 4 }, updated: { b: 20 }, deleted: [ 'a' ] }

console.log(patchObject(initial, diff)); // { b: 20, c: 3, d: 4 }
