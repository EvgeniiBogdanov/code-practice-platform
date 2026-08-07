// Трансформация объектов - Flatten Object
// Реализуйте функцию flattenObject(obj, prefix), которая превращает вложенный объект в плоский объект.
// Ключи вложенных свойств должны соединяться через точку (напр. 'user.address.city').

const flattenObject = (obj, prefix = "") => {
  // Ваш код здесь
};

const nested = {
  user: {
    name: "John",
    address: {
      city: "Moscow",
      zip: 101000,
    },
  },
  active: true,
};

console.log(flattenObject(nested));
// {
//   'user.name': 'John',
//   'user.address.city': 'Moscow',
//   'user.address.zip': 101000,
//   'active': true
// }
