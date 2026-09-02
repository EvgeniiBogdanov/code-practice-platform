// Безопасный доступ и запись по пути объекта: safeGet и safeSet
// Реализуйте функции safeGet(target, path, defaultValue) и safeSet(target, path, value).
// Защита от Prototype Pollution: блокировать модификацию '__proto__', 'prototype', 'constructor'.

const safeGet = (target, path, defaultValue) => {
  // Решение тут
};

const safeSet = (target, path, value) => {
  // Решение тут
};

// Пример вызова:
const state = { user: { profile: { tags: ["dev", "js"] } } };
console.log(safeGet(state, "user.profile.tags[1]")); // 'js'
console.log(safeGet(state, "user.settings.theme", "dark")); // 'dark'

const data = {};
safeSet(data, "order.items[0].id", 101);
console.log(data); // { order: { items: [ { id: 101 } ] } }
