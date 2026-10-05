// LRU Cache на основе Map
// Реализуйте класс LRUCache(capacity) — кэш ограниченного размера, который при переполнении
// удаляет элемент, к которому дольше всего не обращались (Least Recently Used).
// - get(key) — вернуть значение или -1, если ключа нет. Обращение делает ключ самым «свежим».
// - put(key, value) — добавить или обновить значение. Если размер превысил capacity,
//   удалить самый «старый» ключ.
// Обе операции должны работать за O(1).

class LRUCache {
  constructor(capacity) {
    // Решение тут
  }

  get(key) {
    // Решение тут
  }

  put(key, value) {
    // Решение тут
  }
}

// Пример вызова:
const cache = new LRUCache(2);
cache.put(1, "один");
cache.put(2, "два");
console.log(cache.get(1)); // "один" — теперь ключ 1 самый свежий
cache.put(3, "три"); // вытесняет ключ 2
console.log(cache.get(2)); // -1
cache.put(4, "четыре"); // вытесняет ключ 1
console.log(cache.get(1)); // -1
console.log(cache.get(3)); // "три"
console.log(cache.get(4)); // "четыре"
cache.put(3, "три!"); // обновление существующего ключа не вытесняет другие
console.log(cache.get(3)); // "три!"
console.log(cache.get(4)); // "четыре"
