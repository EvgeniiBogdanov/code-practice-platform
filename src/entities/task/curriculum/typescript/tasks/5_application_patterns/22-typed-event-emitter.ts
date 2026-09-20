// Реализуйте типизированный EventEmitter, который для каждого события
// из заранее известной карты событий передаёт подписчику аргумент
// строго определённого типа, соответствующего этому событию.
// Попытка подписаться на несуществующее событие или использовать
// в обработчике аргумент неверного типа должна быть ошибкой типизации.

class EventEmitter {
  listeners = {};

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, payload) {
    (this.listeners[event] || []).forEach((cb) => cb(payload));
  }
}

const emitter = new EventEmitter();

emitter.on("userCreated", (user) => console.log(user.name));
emitter.emit("userCreated", { id: 1, name: "Alice" });
