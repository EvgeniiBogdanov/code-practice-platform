class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    return () => this.off(event, listener);
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
    const remove = this.on(event, (...args) => {
      remove();
      listener(...args);
    });
  }
}

// Пример вызова:
const emitter = new EventEmitter();
const unsubscribe = emitter.on("event", (data) => console.log("Received:", data));
emitter.emit("event", "Hello!"); // Received: Hello!
