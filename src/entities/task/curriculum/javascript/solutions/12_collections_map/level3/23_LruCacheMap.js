class LRUCache {
  constructor(capacity) {
    const cap = Math.floor(Number(capacity));
    if (!Number.isFinite(cap) || cap <= 0) {
      throw new RangeError("Capacity must be a positive integer");
    }
    this.capacity = cap;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

// Пример вызова:
const cache = new LRUCache(2);
cache.put("a", 1);
cache.put("b", 2);
console.log(cache.get("a")); // 1 ('a' теперь самый свежий)

cache.put("c", 3); // емкость превышена! 'b' — самый старый, удаляется!
console.log(cache.get("b")); // undefined
console.log(cache.get("c")); // 3
console.log(cache.get("a")); // 1
