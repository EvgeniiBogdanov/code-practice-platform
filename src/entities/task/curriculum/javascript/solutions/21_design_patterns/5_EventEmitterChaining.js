class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    // Исходная функция нужна, чтобы off(event, listener) находил обёртку
    wrapper.listener = listener;
    return this.on(event, wrapper);
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (!listeners) return this;

    const rest = listeners.filter((item) => item !== listener && item.listener !== listener);
    if (rest.length > 0) {
      this.events.set(event, rest);
    } else {
      this.events.delete(event);
    }
    return this;
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners) return false;

    // Копия списка: подписки и отписки внутри listener не ломают текущий обход
    [...listeners].forEach((listener) => listener(...args));
    return true;
  }
}

// Пример вызова:
const emitter = new EventEmitter();
const log = (msg) => console.log("log:", msg);

emitter
  .on("message", log)
  .once("message", (msg) => console.log("once:", msg))
  .on("close", () => console.log("closed"));

console.log(emitter.emit("message", "hello")); // log: hello, once: hello, затем true
console.log(emitter.emit("message", "again")); // log: again, затем true (once уже отписан)

emitter.off("message", log);
console.log(emitter.emit("message", "nobody")); // false (подписчиков не осталось)
