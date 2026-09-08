const getOwnValues = (obj) => Object.values(obj);

// Пример вызова:
const proto = { inheritedProp: "from_proto" };
const user = Object.create(proto);
user.name = "Иван";
user.age = 30;

console.log(getOwnValues(user)); // ["Иван", 30]
