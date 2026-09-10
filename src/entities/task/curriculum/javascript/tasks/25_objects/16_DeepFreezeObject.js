// Глубокая заморозка объектов (deepFreeze)
// Напишите функцию deepFreeze(obj), которая применяет Object.freeze ко всем вложенным объектам, делая всю структуру неизменяемой.

const deepFreeze = (obj) => {
  // Решение тут
};

// Примеры для проверки:
const user = {
  name: "Ivan",
  profile: {
    age: 30,
    address: { city: "Moscow" },
  },
};

deepFreeze(user);
console.log(Object.isFrozen(user.profile)); // true
console.log(Object.isFrozen(user.profile.address)); // true
