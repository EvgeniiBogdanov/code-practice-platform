// Получение значений собственных свойств объекта
// Напишите функцию getOwnValues(obj), которая принимает объект и возвращает массив значений только его собственных свойств, игнорируя унаследованные свойства из прототипа.

const getOwnValues = (obj) => {
  // Решение тут
};

// Пример вызова:
const proto = { inheritedProp: "from_proto" };
const user = Object.create(proto);
user.name = "Иван";
user.age = 30;

console.log(getOwnValues(user)); // ["Иван", 30]
