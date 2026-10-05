// Генераторы: function* и yield
// 1. idGenerator(prefix) — бесконечный генератор идентификаторов: "user-1", "user-2", ...
// 2. take(iterable, n) — генератор, который берёт первые n значений из любого итерируемого
//    объекта (в том числе бесконечного) и останавливается.
// 3. fibonacci() — бесконечный генератор чисел Фибоначчи: 0, 1, 1, 2, 3, 5, ...

function* idGenerator(prefix) {
  // Решение тут
}

function* take(iterable, n) {
  // Решение тут
}

function* fibonacci() {
  // Решение тут
}

// Пример вызова:
const ids = idGenerator("user");
console.log(ids.next().value); // "user-1"
console.log(ids.next().value); // "user-2"
console.log([...take(idGenerator("order"), 3)]); // ["order-1", "order-2", "order-3"]
console.log([...take(fibonacci(), 10)]); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
console.log([...take([1, 2], 5)]); // [1, 2] — источник закончился раньше

const gen = take(fibonacci(), 2);
console.log(gen.next()); // { value: 0, done: false }
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: undefined, done: true }
