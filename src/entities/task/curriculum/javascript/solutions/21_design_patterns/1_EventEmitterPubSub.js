class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    return {
      unsubscribe: () => this.off(event, listener),
    };
  }

  off(event, listener) {
    if (!this.events.has(event)) return;
    const filtered = this.events.get(event).filter((l) => l !== listener);
    this.events.set(event, filtered);
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return;
    this.events.get(event).forEach((listener) => listener(...args));
  }

  once(event, listener) {
    const sub = this.on(event, (...args) => {
      sub.unsubscribe();
      listener(...args);
    });
  }
}

// Пример вызова:
const emitter = new EventEmitter();
const sub = emitter.on("message", (msg) => console.log("Получено:", msg));
emitter.emit("message", "Привет, мир!"); // "Получено: Привет, мир!"
sub.unsubscribe();
emitter.emit("message", "Снова привет"); // ничего не выводит
