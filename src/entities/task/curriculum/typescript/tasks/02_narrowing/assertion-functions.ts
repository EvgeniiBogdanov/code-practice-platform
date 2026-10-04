// Напишите функции-проверки, после вызова которых TypeScript
// сужает тип значения в оставшейся части функции — без обёртки if.
//
// assert(condition, message) — бросает ошибку, если условие ложно.
// assertIsString(value) — бросает ошибку, если значение не строка.

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const assertIsString = (value) => {
  if (typeof value !== "string") {
    throw new Error("Ожидалась строка");
  }
};

const getApiUrl = (env: Record<string, string | undefined>): string => {
  const url = env.API_URL;
  assert(url !== undefined, "Переменная API_URL не задана");
  return url.toLowerCase();
};

const shout = (value: unknown): string => {
  assertIsString(value);
  return value.toUpperCase();
};
