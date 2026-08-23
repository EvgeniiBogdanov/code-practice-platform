// LRU Cache на базе Map
// Реализуйте класс LRUCache(capacity) с методами get(key) и put(key, value).

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
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // 1
cache.put(3, 3);
console.log(cache.get(2)); // -1
