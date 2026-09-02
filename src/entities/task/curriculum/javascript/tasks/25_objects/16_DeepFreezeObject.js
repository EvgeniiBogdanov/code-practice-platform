// Глубокая заморозка объектов (deepFreeze)
// Напишите функцию deepFreeze(obj), которая применяет Object.freeze ко всем вложенным объектам, делая всю структуру неизменяемой.

const deepFreeze = (obj) => {
  // Решение тут
};

// Пример вызова:
const config = { api: { host: "localhost", port: 8080 } };
deepFreeze(config);
console.log(Object.isFrozen(config));     // true
console.log(Object.isFrozen(config.api)); // true
