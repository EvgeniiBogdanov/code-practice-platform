// Глубокая заморозка объекта (Deep Freeze)
// Напишите функцию deepFreeze(obj), рекурсивно вызывающую Object.freeze.

const deepFreeze = (obj) => {
  // Решение тут
};

// Пример вызова:
const user = { profile: { name: "Ivan" } };
deepFreeze(user);
console.log(Object.isFrozen(user.profile)); // true
