// Напишите memoizeAsync(fn), кэширующую результат
// по аргументам, чтобы повторный вызов с теми же
// аргументами не выполнял fn заново, а брал из кэша.

let callCount = 0;
const fetchSquare = (n) => {
  callCount++;
  return new Promise((resolve) => setTimeout(() => resolve(n * n), 100));
};

const memoizeAsync = (fn) => {
  // Ваш код здесь
};

const memoized = memoizeAsync(fetchSquare);
