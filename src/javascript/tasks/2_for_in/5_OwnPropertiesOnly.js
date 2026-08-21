// Фильтрация собственных свойств (Object.hasOwn)
// Напишите функцию getOwnValues(obj), которая принимает объект (который может наследовать свойства из прототипа) и возвращает массив значений ТОЛЬКО собственных свойств объекта с помощью for...in и Object.hasOwn.

const getOwnValues = (obj) => {
  // Решение тут
};

// Пример вызова:
const proto = { inheritedProp: "from_proto" };
const user = Object.create(proto);
user.name = "Иван";
user.age = 30;

console.log(getOwnValues(user)); // ["Иван", 30]
