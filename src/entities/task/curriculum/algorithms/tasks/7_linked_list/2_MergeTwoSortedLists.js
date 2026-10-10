// Две очереди заявок отсортированы по времени и хранятся как односвязные списки.
// Напишите функцию mergeTwoLists(list1, list2), которая сливает их в одну
// отсортированную очередь, переиспользуя существующие узлы (без создания новых),
// и возвращает её голову.

const { createListNode, createLinkedList, linkedListToArray } = require('./helpers');

const mergeTwoLists = (list1, list2) => {
  // Решение тут
};

// Пример вызова:
const a1 = createLinkedList([1, 5, 9]);
const b1 = createLinkedList([2, 5, 6, 10]);
console.log(linkedListToArray(mergeTwoLists(a1, b1))); // [1, 2, 5, 5, 6, 9, 10]

const a2 = createLinkedList([]);
const b2 = createLinkedList([3]);
console.log(linkedListToArray(mergeTwoLists(a2, b2))); // [3]

const a3 = createLinkedList([4, 8]);
const b3 = createLinkedList([]);
console.log(linkedListToArray(mergeTwoLists(a3, b3))); // [4, 8]
