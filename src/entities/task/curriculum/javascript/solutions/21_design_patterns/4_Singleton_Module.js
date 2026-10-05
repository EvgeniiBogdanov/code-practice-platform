// Идиоматичный для JS вариант: модуль (здесь — IIFE) создаётся один раз,
// а все импорты получают одну и ту же ссылку. Класс не нужен.
const appConfig = (() => {
  const settings = new Map();

  return Object.freeze({
    get: (key) => settings.get(key),
    set: (key, value) => {
      settings.set(key, value);
    },
  });
})();

// В реальном проекте: export const appConfig = ...; в любом файле import { appConfig } from "./app-config";

// Пример вызова:
const first = appConfig;
const second = appConfig;
console.log(first === second); // true

first.set("theme", "dark");
console.log(second.get("theme")); // "dark"
console.log(appConfig.get("theme")); // "dark"
console.log(first.get("missing")); // undefined
