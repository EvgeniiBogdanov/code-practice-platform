const getOwnValues = (obj) => {
  const result = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result.push(obj[key]);
    }
  }

  return result;
};

// Пример вызова:
const proto = { inheritedProp: "from_proto" };
const user = Object.create(proto);
user.name = "Иван";
user.age = 30;

console.log(getOwnValues(user)); // ["Иван", 30]
