# Связный список (Linked List) на JavaScript — полный разбор для новичков

## Содержание

1. [Что такое связный список](#что-такое-связный-список)
2. [Связный список vs Массив](#связный-список-vs-массив)
3. [Виды связных списков](#виды-связных-списков)
4. [Узел (Node) — базовый строительный блок](#узел-node--базовый-строительный-блок)
5. [Реализация односвязного списка](#реализация-односвязного-списка)
6. [Разбор каждого метода](#разбор-каждого-метода)
7. [Сложность операций (Big O)](#сложность-операций-big-o)
8. [Двусвязный список (Doubly Linked List)](#двусвязный-список-doubly-linked-list)
9. [Кольцевой список (Circular Linked List)](#кольцевой-список-circular-linked-list)
10. [Классические задачи с собеседований](#классические-задачи-с-собеседований)
11. [Подводные камни](#подводные-камни)
12. [Когда использовать связный список, а когда — нет](#когда-использовать-связный-список-а-когда--нет)
13. [Полезные источники](#полезные-источники)

---

## Что такое связный список

**Связный список (Linked List)** — это линейная структура данных, где элементы (узлы) хранятся не подряд в памяти (как массив), а каждый элемент содержит:

- **данные** (`value`);
- **ссылку** на следующий элемент (`next`).

Схематично это выглядит так:

```
[10 | next] → [20 | next] → [30 | next] → null
  head                         tail
```

Список хранит только ссылку на **первый** узел — `head`. Чтобы добраться до третьего элемента, нужно пройти через первый и второй — прямого доступа по индексу, как в массиве (`arr[2]`), нет.

Аналогия: представьте цепочку из вагончиков поезда. У каждого вагона есть груз (данные) и крюк (`next`), которым он цепляется к следующему вагону. Чтобы попасть в последний вагон, нужно пройти через все предыдущие.

---

## Связный список vs Массив

| Критерий | Массив (Array) | Связный список (Linked List) |
|---|---|---|
| Память | Непрерывный блок памяти | Узлы разбросаны по памяти, связаны ссылками |
| Доступ по индексу | O(1) | O(n) |
| Вставка/удаление в начало | O(n) — сдвиг всех элементов | O(1) |
| Вставка/удаление в середину | O(n) | O(n) на поиск + O(1) на саму вставку |
| Вставка/удаление в конец | O(1) (amortized, если это push) | O(1) — если хранится `tail`, иначе O(n) |
| Использование памяти | Компактнее (нет доп. ссылок) | Больше — на каждый элемент нужна ссылка `next` (и `prev` для двусвязного) |
| Кэш-локальность (скорость на практике) | Высокая — данные лежат рядом | Низкая — данные "прыгают" по памяти |

**Вывод**: связный список выигрывает там, где часто нужно вставлять/удалять элементы в начале или середине, а массив — там, где важен быстрый доступ по индексу.

---

## Виды связных списков

1. **Односвязный список (Singly Linked List)** — каждый узел ссылается только на следующий.
2. **Двусвязный список (Doubly Linked List)** — каждый узел ссылается и на следующий, и на предыдущий.
3. **Кольцевой список (Circular Linked List)** — последний узел ссылается не на `null`, а обратно на первый (`head`), образуя кольцо.

Разберём всё по порядку, начиная с самого простого — односвязного списка.

---

## Узел (Node) — базовый строительный блок

Узел — это просто объект с двумя полями. Реализуем его через функцию-фабрику со стрелочной функцией:

```js
const createNode = (value) => ({
  value,
  next: null,
});

// Пример
const node = createNode(10);
console.log(node); // { value: 10, next: null }
```

Можно также сделать через класс — это тоже нормальная практика, особенно если список большой и важна производительность (классы работают чуть быстрее фабричных функций за счёт V8-оптимизаций):

```js
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
```

В этом разборе будем использовать класс для структуры данных `LinkedList`, но все **методы** реализуем через стрелочные функции — как просили в задании (плюс это удобно, так как стрелочные функции не переопределяют `this`, что защищает от классической ошибки при передаче метода как колбэка).

---

## Реализация односвязного списка

```js
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // Добавить элемент в конец списка — O(1)
  append = (value) => {
    const node = new Node(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
    return this;
  };

  // Добавить элемент в начало списка — O(1)
  prepend = (value) => {
    const node = new Node(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }

    this.length++;
    return this;
  };

  // Вставить элемент по индексу — O(n)
  insertAt = (value, index) => {
    if (index < 0 || index > this.length) {
      throw new Error("Индекс вне диапазона");
    }

    if (index === 0) return this.prepend(value);
    if (index === this.length) return this.append(value);

    const node = new Node(value);
    let prevNode = this.head;

    for (let i = 0; i < index - 1; i++) {
      prevNode = prevNode.next;
    }

    node.next = prevNode.next;
    prevNode.next = node;
    this.length++;

    return this;
  };

  // Удалить первый узел с данным значением — O(n)
  remove = (value) => {
    if (!this.head) return null;

    if (this.head.value === value) {
      this.head = this.head.next;
      if (!this.head) this.tail = null; // список опустел
      this.length--;
      return value;
    }

    let current = this.head;

    while (current.next) {
      if (current.next.value === value) {
        if (current.next === this.tail) {
          this.tail = current;
        }
        current.next = current.next.next;
        this.length--;
        return value;
      }
      current = current.next;
    }

    return null; // не нашли
  };

  // Удалить узел по индексу — O(n)
  removeAt = (index) => {
    if (index < 0 || index >= this.length) {
      throw new Error("Индекс вне диапазона");
    }

    if (index === 0) {
      const removed = this.head;
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      this.length--;
      return removed.value;
    }

    let prevNode = this.head;
    for (let i = 0; i < index - 1; i++) {
      prevNode = prevNode.next;
    }

    const removed = prevNode.next;
    prevNode.next = removed.next;
    if (removed === this.tail) this.tail = prevNode;

    this.length--;
    return removed.value;
  };

  // Найти узел по значению — O(n)
  find = (value) => {
    let current = this.head;

    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }

    return null;
  };

  // Получить значение по индексу — O(n)
  get = (index) => {
    if (index < 0 || index >= this.length) return null;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }

    return current.value;
  };

  // Развернуть список — O(n)
  reverse = () => {
    let prev = null;
    let current = this.head;
    this.tail = this.head;

    while (current) {
      const next = current.next; // запоминаем следующий узел
      current.next = prev;       // разворачиваем ссылку
      prev = current;            // двигаем prev вперёд
      current = next;            // двигаем current вперёд
    }

    this.head = prev;
    return this;
  };

  // Превратить список в обычный массив (для удобства отладки/вывода)
  toArray = () => {
    const result = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  };

  // Список пуст?
  isEmpty = () => this.length === 0;
}
```

### Пример использования

```js
const list = new LinkedList();

list.append(10);
list.append(20);
list.append(30);
list.prepend(5);

console.log(list.toArray()); // [5, 10, 20, 30]

list.insertAt(15, 2);
console.log(list.toArray()); // [5, 10, 15, 20, 30]

list.remove(15);
console.log(list.toArray()); // [5, 10, 20, 30]

console.log(list.get(1));    // 10
console.log(list.find(20));  // Node { value: 20, next: ... }

list.reverse();
console.log(list.toArray()); // [30, 20, 10, 5]
```

---

## Разбор каждого метода

### `append(value)` — добавление в конец

Если список пуст, новый узел становится и `head`, и `tail`. Если нет — просто "прицепляем" его к текущему `tail` и обновляем `tail`. Именно поэтому хранить ссылку на `tail` критически важно: без неё пришлось бы каждый раз идти от `head` до конца списка, и `append` превратился бы в O(n).

### `prepend(value)` — добавление в начало

Здесь всё просто: новый узел указывает на старый `head`, а затем сам становится новым `head`. Это операция O(1) — главное преимущество связного списка перед массивом (`array.unshift()` — это O(n), так как приходится сдвигать все элементы).

### `insertAt(value, index)` — вставка по индексу

Нужно найти узел **перед** тем местом, куда вставляем (`prevNode`), затем:

```
prevNode → newNode → (то, на что раньше указывал prevNode)
```

Порядок операций важен: сначала `node.next = prevNode.next`, **потом** `prevNode.next = node`. Если поменять местами — потеряете хвост списка (типичная ошибка, см. раздел "Подводные камни").

### `remove(value)` / `removeAt(index)` — удаление

Логика похожа на вставку "наоборот": находим узел **перед** удаляемым и "перепрыгиваем" через удаляемый узел:

```
prevNode.next = prevNode.next.next
```

Сам удаляемый узел никуда физически не девается сразу — просто на него больше никто не ссылается, и сборщик мусора (garbage collector) со временем освободит память.

### `reverse()` — разворот списка

Это самый концептуально сложный метод для новичков. Идея: идём по списку и у каждого узла перенаправляем `next` на **предыдущий** узел вместо следующего.

Три переменные — `prev`, `current`, `next` — как три бегунка, которые двигаются по списку синхронно:

```
До:     null    1 → 2 → 3 → null
Шаг 1:  null ← 1    2 → 3 → null
              prev cur

Шаг 2:  null ← 1 ← 2    3 → null
                    prev cur

Шаг 3:  null ← 1 ← 2 ← 3    null
                        prev cur (null)
```

В конце `prev` указывает на новую голову списка.

---

## Сложность операций (Big O)

| Операция | Односвязный список | Массив |
|---|---|---|
| Доступ по индексу (`get`) | O(n) | O(1) |
| Поиск по значению (`find`) | O(n) | O(n) |
| Вставка в начало | O(1) | O(n) |
| Вставка в конец (при наличии `tail`) | O(1) | O(1)* |
| Вставка в середину | O(n) | O(n) |
| Удаление из начала | O(1) | O(n) |
| Удаление из конца | O(n) (для односвязного, O(1) для двусвязного) | O(1) |
| Удаление из середины | O(n) | O(n) |

\* amortized O(1) — из-за периодического реаллоцирования памяти под массив.

---

## Двусвязный список (Doubly Linked List)

В двусвязном списке у каждого узла есть ссылка не только на `next`, но и на `prev`. Это позволяет двигаться в обе стороны и удалять узлы за O(1), если у вас уже есть ссылка на нужный узел (не нужно искать "предыдущий").

```
null ← [10] ⇄ [20] ⇄ [30] → null
       head            tail
```

```js
class DoublyNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append = (value) => {
    const node = new DoublyNode(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
    return this;
  };

  prepend = (value) => {
    const node = new DoublyNode(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }

    this.length++;
    return this;
  };

  // Удаление конкретного узла за O(1), если узел уже известен
  removeNode = (node) => {
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next; // удаляли head

    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev; // удаляли tail

    this.length--;
    return node.value;
  };

  // Обход в обратном направлении — то, чего нет в односвязном списке
  toArrayReversed = () => {
    const result = [];
    let current = this.tail;

    while (current) {
      result.push(current.value);
      current = current.prev;
    }

    return result;
  };

  toArray = () => {
    const result = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  };
}
```

**Плюсы двусвязного списка**: удаление за O(1) при наличии ссылки на узел, обход в обе стороны.
**Минусы**: на каждый узел уходит больше памяти (лишняя ссылка `prev`), логика сложнее — легче допустить ошибку и "порвать" список.

---

## Кольцевой список (Circular Linked List)

Отличие только одно: `tail.next` указывает не на `null`, а обратно на `head`.

```js
class CircularLinkedList extends LinkedList {
  append = (value) => {
    const node = new Node(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
      node.next = node; // сам на себя
    } else {
      this.tail.next = node;
      this.tail = node;
      this.tail.next = this.head; // замыкаем кольцо
    }

    this.length++;
    return this;
  };

  // Обход кольца — нужен явный счётчик или условие,
  // иначе цикл никогда не остановится!
  toArray = () => {
    const result = [];
    if (!this.head) return result;

    let current = this.head;
    do {
      result.push(current.value);
      current = current.next;
    } while (current !== this.head);

    return result;
  };
}
```

Используется, например, для реализации круговых очередей (round-robin планировщики задач в ОС, буферы воспроизведения плейлистов).

---

## Классические задачи с собеседований

### 1. Найти середину списка (Fast & Slow Pointers)

```js
const findMiddle = (head) => {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow; // когда fast дойдёт до конца, slow будет в середине
};
```

Идея: "быстрый" указатель бежит в 2 раза быстрее "медленного". Когда быстрый добегает до конца, медленный оказывается ровно посередине.

### 2. Определить цикл в списке (Floyd's Cycle Detection / "Алгоритм черепахи и зайца")

```js
const hasCycle = (head) => {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) return true; // указатели встретились — есть цикл
  }

  return false;
};
```

Если в списке есть цикл, "быстрый" указатель рано или поздно "догонит" медленный внутри цикла — они не могут разминуться навсегда, как две стрелки часов с разной скоростью.

### 3. Объединить два отсортированных списка

```js
const mergeTwoSortedLists = (l1, l2) => {
  const dummy = new Node(null); // фиктивный узел — упрощает код
  let current = dummy;

  while (l1 && l2) {
    if (l1.value <= l2.value) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 || l2; // прицепляем остаток
  return dummy.next;
};
```

Приём с `dummy`-узлом (фиктивной "заглушкой") — классика для задач со связными списками. Он избавляет от необходимости отдельно обрабатывать случай "первый элемент результата".

### 4. Удалить N-й элемент с конца за один проход

```js
const removeNthFromEnd = (head, n) => {
  const dummy = new Node(null);
  dummy.next = head;

  let fast = dummy;
  let slow = dummy;

  // сдвигаем fast на n шагов вперёд
  for (let i = 0; i < n; i++) {
    fast = fast.next;
  }

  // двигаем оба указателя, пока fast не дойдёт до конца
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }

  slow.next = slow.next.next; // удаляем нужный узел
  return dummy.next;
};
```

---

## Подводные камни

Здесь собраны ошибки, которые чаще всего допускают новички.

### 1. Потеря ссылки на хвост списка при вставке

```js
//  Неправильно — сначала меняем prevNode.next
prevNode.next = node;
node.next = prevNode.next; // здесь node.next уже указывает сам на себя!

//  Правильно — сначала "запоминаем" следующий узел
node.next = prevNode.next;
prevNode.next = node;
```

**Всегда** сначала присваивайте `next` новому узлу, а уже потом переключайте ссылку у предыдущего.

### 2. Забыли обновить `tail` при удалении последнего элемента

Если удаляете узел, который был `tail`, обязательно обновляйте `this.tail`, иначе он будет "висеть" на удалённом узле, и следующий `append` физически прицепит элемент к узлу, до которого уже никто не может добраться.

### 3. Забыли обновить `head`/`tail`, когда список опустел

После удаления последнего оставшегося элемента и `head`, и `tail` должны стать `null`. Забытая проверка — частый источник багов "список показывает элемент, хотя должен быть пуст".

### 4. Бесконечный цикл при обходе кольцевого списка

```js
//  Никогда не остановится — в кольце нет узла с next === null
let current = head;
while (current) {
  console.log(current.value);
  current = current.next;
}

//  Используем do...while с условием возврата к head
let current = head;
do {
  console.log(current.value);
  current = current.next;
} while (current !== head);
```

### 5. Мутация исходного списка, когда этого не просили

`reverse()`, реализованный выше, мутирует список "на месте" (in-place). Если вам нужно вернуть **новый** список, не трогая исходный, — создавайте новые узлы, а не переиспользуйте старые:

```js
const reversedCopy = (head) => {
  let newHead = null;
  let current = head;

  while (current) {
    const node = new Node(current.value); // новый узел!
    node.next = newHead;
    newHead = node;
    current = current.next;
  }

  return newHead;
};
```

### 6. Сравнение узлов через `==`/`===`, когда нужно сравнивать значения

`node1 === node2` сравнивает **ссылки** на объекты, а не их содержимое. Если хотите сравнить "одинаковые ли данные внутри", сравнивайте `node1.value === node2.value`.

### 7. Забытая проверка на пустой список (`null` head)

Практически в каждом методе первая строка должна проверять `if (!this.head)`. Без этой проверки любое обращение вида `this.head.value` на пустом списке упадёт с `TypeError: Cannot read properties of null`.

### 8. Использование стрелочных методов класса при наследовании

Стрелочные методы, объявленные как class fields (`append = () => {...}`), **не попадают в прототип класса** — они создаются заново для каждого экземпляра. Это делает `this` предсказуемым (не нужно вручную биндить), но:

- немного увеличивает потребление памяти на больших коллекциях объектов;
- при наследовании (как в примере `CircularLinkedList extends LinkedList`) переопределение таких методов работает нормально, но `super.append()` внутри стрелочного метода работать **не будет** так же интуитивно, как в обычном методе прототипа — будьте аккуратны, если решите миксовать оба подхода.

Для учебных и большинства практических целей это не критично, но полезно понимать разницу.

### 9. Забыть, что `find`/`get` возвращают `null`, а не `undefined`

Если написать `if (list.find(x))` — сработает правильно, но если сравнивать строго (`=== undefined`), можно словить баг. Всегда сверяйтесь с тем, что именно возвращает ваш метод при "не найдено".

---

## Когда использовать связный список, а когда — нет

**Используйте Linked List, если:**
- часто вставляете/удаляете элементы в начале или середине коллекции;
- заранее неизвестен размер коллекции и важно избежать переаллокации памяти;
- реализуете другие структуры данных поверх него — стек, очередь, хеш-таблицу (разрешение коллизий методом цепочек), LRU-кэш (обычно на двусвязном списке + хеш-таблице).

**Не используйте, если:**
- вам нужен частый доступ по индексу — массив здесь быстрее на порядок;
- важна кэш-локальность и максимальная производительность (в реальных JS-движках массивы почти всегда быстрее на практике из-за особенностей работы с памятью и JIT-оптимизаций);
- список небольшой — накладные расходы на ссылки того не стоят.

В повседневной JS-разработке связный список **редко** нужен напрямую (в отличие от алгоритмических собеседований) — обычно достаточно встроенного `Array`. Но понимание этой структуры критически важно для понимания того, как устроены другие структуры данных (деревья, графы, стеки, очереди) и почему в собеседованиях так часто спрашивают именно про неё — она отлично проверяет умение работать с указателями/ссылками.

---

