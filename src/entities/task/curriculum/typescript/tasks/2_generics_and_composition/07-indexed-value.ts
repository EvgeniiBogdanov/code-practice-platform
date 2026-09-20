// Типизируйте функцию getValue.
// Функция должна позволять получать значение из объекта obj по существующему ключу.
// TypeScript должен корректно определять тип возвращаемого значения.

const obj = {
  a: 1,
  b: 2,
  c: "a",
};

const getValue = (obj, key) => {
  return obj[key];
};

const res1 = getValue(obj, "a");
