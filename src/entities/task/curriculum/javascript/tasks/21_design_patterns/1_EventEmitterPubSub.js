// Паттерн EventEmitter (Pub/Sub)
// Реализуйте класс EventEmitter с методами on, emit, off, once.

class EventEmitter {
  // Решение тут
}

// Пример вызова:
const emitter = new EventEmitter();
const unsubscribe = emitter.on("event", (data) => console.log("Received:", data));
emitter.emit("event", "Hello!"); // Received: Hello!
