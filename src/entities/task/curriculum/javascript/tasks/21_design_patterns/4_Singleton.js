// Паттерн Singleton (Одиночка)
// Реализуйте класс AppConfig, у которого может существовать только один экземпляр:
// - статический метод AppConfig.getInstance() всегда возвращает один и тот же объект;
// - повторный new AppConfig() возвращает уже созданный экземпляр, а не новый объект;
// - методы get(key) и set(key, value) работают с общими настройками.

class AppConfig {
  // Решение тут
}

// Пример вызова:
const first = AppConfig.getInstance();
const second = new AppConfig();
console.log(first === second); // true

first.set("theme", "dark");
console.log(second.get("theme")); // "dark"
console.log(AppConfig.getInstance().get("theme")); // "dark"
console.log(first.get("missing")); // undefined
