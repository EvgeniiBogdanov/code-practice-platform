// Object.create(null) и защита от Prototype Pollution
// 1. Напишите функцию createCleanDictionary(), возвращающую чистый объект без прототипа ([[Prototype]] === null).
// 2. Напишите функцию safeDeepAssign(target, source), выполняющую безопасное рекурсивное слияние plain-объектов
// с защитой от Prototype Pollution (блокируя опасные ключи '__proto__', 'constructor', 'prototype').

const createCleanDictionary = () => {
  // Решение тут
};

const safeDeepAssign = (target, source) => {
  // Решение тут
};

// Пример вызова:
const dict = createCleanDictionary();
console.log(Object.getPrototypeOf(dict)); // null
console.log(dict.toString); // undefined

const safeTarget = {};
const maliciousPayload = JSON.parse('{"__proto__": {"isAdmin": true, "role": "root"}}');

safeDeepAssign(safeTarget, maliciousPayload);

console.log(({}).isAdmin); // undefined
console.log(({}).role); // undefined
console.log(safeTarget.isAdmin); // undefined
