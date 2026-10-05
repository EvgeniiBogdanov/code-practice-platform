class AppConfig {
  // Единственный экземпляр хранится в приватном статическом поле
  static #instance = null;

  #settings = new Map();

  constructor() {
    // Если объект возвращается из конструктора, new вернёт именно его
    if (AppConfig.#instance) {
      return AppConfig.#instance;
    }
    AppConfig.#instance = this;
  }

  static getInstance() {
    return AppConfig.#instance ?? new AppConfig();
  }

  get(key) {
    return this.#settings.get(key);
  }

  set(key, value) {
    this.#settings.set(key, value);
  }
}

// Пример вызова:
const first = AppConfig.getInstance();
const second = new AppConfig();
console.log(first === second); // true

first.set("theme", "dark");
console.log(second.get("theme")); // "dark"
console.log(AppConfig.getInstance().get("theme")); // "dark"
console.log(first.get("missing")); // undefined
