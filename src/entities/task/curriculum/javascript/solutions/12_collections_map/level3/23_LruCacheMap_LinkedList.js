// Классическая реализация без опоры на порядок Map:
// хеш-таблица для поиска узла за O(1) + двусвязный список для порядка использования
class ListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.nodes = new Map();
    // Фиктивные голова и хвост избавляют от проверок на null
    this.head = new ListNode(null, null); // рядом с head — самый старый
    this.tail = new ListNode(null, null); // рядом с tail — самый свежий
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  append(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  get(key) {
    const node = this.nodes.get(key);
    if (!node) {
      return -1;
    }
    this.remove(node);
    this.append(node);
    return node.value;
  }

  put(key, value) {
    const existing = this.nodes.get(key);
    if (existing) {
      existing.value = value;
      this.remove(existing);
      this.append(existing);
      return;
    }

    const node = new ListNode(key, value);
    this.nodes.set(key, node);
    this.append(node);

    if (this.nodes.size > this.capacity) {
      const oldest = this.head.next;
      this.remove(oldest);
      this.nodes.delete(oldest.key);
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
