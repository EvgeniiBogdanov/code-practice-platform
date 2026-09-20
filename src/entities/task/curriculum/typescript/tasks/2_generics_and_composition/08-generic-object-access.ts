// Типизируйте функцию getValue,
// чтобы можно было получать значение из любого объекта по его ключу.

const obj = {
  a: 1,
  b: 2,
  c: "a",
};

const getValue = (obj, key) => {
  return obj[key];
};

const res1 = getValue(obj, "a");
