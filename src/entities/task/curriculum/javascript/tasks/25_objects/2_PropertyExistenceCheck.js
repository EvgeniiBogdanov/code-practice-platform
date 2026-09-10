// Проверка существования свойств (in vs Object.hasOwn vs hasOwnProperty)
// Напишите функцию hasProperty(obj, prop, checkPrototype = false), которая:
// 1. Принимает объект obj, имя свойства prop и флаг checkPrototype (по умолчанию false).
// 2. Если checkPrototype === true, проверяет наличие свойства с учетом цепочки прототипов (оператор in).
// 3. Если checkPrototype === false, проверяет наличие только собственного свойства (Object.hasOwn).
// 4. Корректно обрабатывает null, примитивы и объекты без прототипа (Object.create(null)).

const hasProperty = (obj, prop, checkPrototype = false) => {
  // Решение тут
};

// Пример вызова:
const proto = { inheritedProp: "from proto" };
const user = Object.create(proto);
user.ownProp = "own value";
user.falsyProp = undefined;

console.log(hasProperty(user, "ownProp", false));         // true
console.log(hasProperty(user, "falsyProp", false));       // true
console.log(hasProperty(user, "inheritedProp", false));   // false
console.log(hasProperty(user, "inheritedProp", true));    // true
console.log(hasProperty(user, "toString", true));         // true

const cleanObj = Object.create(null);
cleanObj.secret = 42;
console.log(hasProperty(cleanObj, "secret", false));      // true
console.log(hasProperty(cleanObj, "missing", false));     // false
