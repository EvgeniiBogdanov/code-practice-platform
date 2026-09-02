// Проверка существования свойства в объекте
// Напишите функцию hasProperty(obj, prop), проверяющую наличие собственного свойства в объекте (без проверки прототипа).

const hasProperty = (obj, prop) => {
  // Решение тут
};

// Пример вызова:
const user = { name: "Alice", age: undefined };
console.log(hasProperty(user, "name")); // true
console.log(hasProperty(user, "age"));  // true
console.log(hasProperty(user, "city")); // false
