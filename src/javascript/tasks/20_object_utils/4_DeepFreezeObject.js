// Заморозка объектов - Deep Freeze
// Реализуйте функцию deepFreeze(obj), которая рекурсивно замораживает объект и все его вложенные объекты/массивы.

const deepFreeze = (obj) => {
  // Ваш код здесь
};

const user = {
  name: "Alex",
  info: {
    age: 30,
    hobbies: ["reading", "coding"],
  },
};

deepFreeze(user);

user.name = "Bob"; // Не изменится
user.info.age = 35; // Не изменится

console.log(user.name); // "Alex"
console.log(user.info.age); // 30
console.log(Object.isFrozen(user.info)); // true
console.log(Object.isFrozen(user.info.hobbies)); // true
