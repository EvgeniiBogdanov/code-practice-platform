function* idGenerator(prefix) {
  let id = 1;
  // Бесконечный цикл безопасен: генератор приостанавливается на каждом yield
  while (true) {
    yield `${prefix}-${id}`;
    id++;
  }
}

function* take(iterable, n) {
  if (n <= 0) {
    return;
  }

  let count = 0;
  for (const item of iterable) {
    yield item;
    count++;
    if (count >= n) {
      // return внутри for...of закрывает исходный итератор (вызывает его return())
      return;
    }
  }
}

function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Пример вызова:
const ids = idGenerator("user");
console.log(ids.next().value); // "user-1"
console.log(ids.next().value); // "user-2"
console.log([...take(idGenerator("order"), 3)]); // ["order-1", "order-2", "order-3"]
console.log([...take(fibonacci(), 10)]); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
console.log([...take([1, 2], 5)]); // [1, 2]

const gen = take(fibonacci(), 2);
console.log(gen.next()); // { value: 0, done: false }
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: undefined, done: true }
