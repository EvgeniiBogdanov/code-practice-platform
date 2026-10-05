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
const cache = new LRUCache(2);
cache.put(1, "один");
cache.put(2, "два");
console.log(cache.get(1)); // "один"
cache.put(3, "три"); // вытесняет ключ 2
console.log(cache.get(2)); // -1
cache.put(4, "четыре"); // вытесняет ключ 1
console.log(cache.get(1)); // -1
console.log(cache.get(3)); // "три"
console.log(cache.get(4)); // "четыре"
cache.put(3, "три!");
console.log(cache.get(3)); // "три!"
console.log(cache.get(4)); // "четыре"
