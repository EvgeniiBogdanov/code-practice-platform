// Реализация паттерна EventEmitter (Pub/Sub)
// Реализуйте класс EventEmitter со следующими методами:
// 1. on(event, callback) — подписывает callback на событие event. Возвращает объект с методом unsubscribe().
// 2. emit(event, ...args) — вызывает всех подписчиков события event с переданными аргументами.
// 3. off(event, callback) — отписывает конкретный callback от события.

class EventEmitter {
  // Решение тут
}

// Пример вызова:
const emitter = new EventEmitter();
const sub = emitter.on("message", (msg) => console.log("Получено:", msg));
emitter.emit("message", "Привет, мир!"); // "Получено: Привет, мир!"
sub.unsubscribe();
emitter.emit("message", "Снова привет"); // ничего не выводит
