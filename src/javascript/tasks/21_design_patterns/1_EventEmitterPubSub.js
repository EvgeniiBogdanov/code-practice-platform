// Паттерн Наблюдатель (Publish-Subscribe / Event Emitter)
// Реализуйте класс EventEmitter с методами:
// - on(event, listener): подписка на событие
// - off(event, listener): отписка от события
// - once(event, listener): однократная подписка
// - emit(event, ...args): вызов всех обработчиков события

class EventEmitter {
  // Ваш код здесь
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
