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
const cache = new LRUCache(3);
cache.put("a", 1);
cache.put("b", 2);
cache.put("c", 3);
console.log(cache.get("a")); // 1
cache.put("d", 4); // вытесняет "b" — к нему дольше всего не обращались
console.log(cache.get("b")); // -1
cache.put("c", 30); // обновление существующего ключа ничего не вытесняет
cache.put("e", 5); // вытесняет "a"
console.log(cache.get("a")); // -1
console.log(cache.get("c")); // 30
console.log(cache.get("d")); // 4
console.log(cache.get("e")); // 5
