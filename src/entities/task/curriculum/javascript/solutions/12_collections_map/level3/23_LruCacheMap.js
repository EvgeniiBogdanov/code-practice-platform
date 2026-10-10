class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    // Map помнит порядок вставки: первый ключ — самый старый, последний — самый свежий
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // «Освежаем» ключ: удаляем и вставляем заново в конец
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    // При обновлении тоже переносим ключ в конец
    this.cache.delete(key);
    this.cache.set(key, value);

    if (this.cache.size > this.capacity) {
      // keys() возвращает итератор в порядке вставки — первый ключ самый старый
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
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
