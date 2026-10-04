// Типизируйте функции.
// greet: параметр greeting необязателен и по умолчанию равен "Привет".
// sum: принимает любое количество чисел.
// applyToAll: получает массив чисел и функцию-преобразователь для каждого элемента.
// logMessage: уровень сообщения необязателен, функция ничего не возвращает.

const greet = (name, greeting = "Привет") => {
  return `${greeting}, ${name}!`;
};

const sum = (...numbers) => {
  return numbers.reduce((total, n) => total + n, 0);
};

const applyToAll = (items, transform) => {
  return items.map(transform);
};

const logMessage = (message, level) => {
  console.log(`[${level ?? "info"}] ${message}`);
};

greet("Alice");
sum(1, 2, 3);
applyToAll([1, 2, 3], (n) => n * 2);
logMessage("Сервер запущен");
