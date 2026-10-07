// EventEmitter с цепочками вызовов (chaining) и once
// Реализуйте класс EventEmitter со следующими методами:
// 1. on(event, listener) — подписывает listener на событие. Возвращает this, чтобы вызовы можно было объединять в цепочку.
// 2. once(event, listener) — подписывает listener на ОДИН вызов: после первого emit он автоматически отписывается. Возвращает this.
// 3. off(event, listener) — удаляет подписку. Должен работать и для listener, переданного в once (по исходной функции). Возвращает this.
// 4. emit(event, ...args) — вызывает подписчиков в порядке подписки с переданными аргументами.
//    Возвращает true, если у события были подписчики, и false в противном случае.
//
// Подписки, добавленные или удалённые во время emit, не должны влиять на текущий обход.
// Одна и та же функция может быть подписана несколько раз; off удаляет все её подписки на это событие.

class EventEmitter {
  // Решение тут
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
