// Паттерн Наблюдатель (Publish-Subscribe / Event Emitter)

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  off(event, listener) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(
      (l) => l !== listener && l.originalListener !== listener
    );
    return this;
  }

  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };
    onceWrapper.originalListener = listener;
    this.on(event, onceWrapper);
    return this;
  }

  emit(event, ...args) {
    if (!this.events[event]) return false;
    const listeners = [...this.events[event]];
    listeners.forEach((listener) => listener.apply(this, args));
    return true;
  }
}

const emitter = new EventEmitter();

const logData = (data) => console.log("Data:", data);
emitter.on("message", logData);
emitter.once("connect", () => console.log("Connected!"));

emitter.emit("message", "Hello World"); // Data: Hello World
emitter.emit("connect"); // Connected!
emitter.emit("connect"); // Ничего не выведет (once)

emitter.off("message", logData);
emitter.emit("message", "Hello World 2"); // Ничего не выведет
