// Обнаружение циклических ссылок в объекте
// Напишите функцию hasCircularReference(obj), которая проверяет, содержит ли объект циклическую ссылку на самого себя или предков.

const hasCircularReference = (obj) => {
  // Решение тут
};

// Пример вызова:
const objA = { name: "A" };
const objB = { name: "B", ref: objA };
console.log(hasCircularReference(objB)); // false

objA.ref = objB; // создали цикл: objA -> objB -> objA
console.log(hasCircularReference(objA)); // true
