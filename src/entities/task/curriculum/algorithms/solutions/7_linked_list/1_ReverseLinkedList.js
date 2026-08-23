const { createLinkedList, linkedListToArray } = require('./helpers');

const reverseList = (head) => {
  let prev = null;
  let current = head;

  while (current !== null) {
    const nextTemp = current.next;
    current.next = prev;
    prev = current;
    current = nextTemp;
  }

  return prev;
};

// Пример вызова:
const list1 = createLinkedList([1, 2, 3, 4, 5]);
console.log(linkedListToArray(reverseList(list1))); // [5, 4, 3, 2, 1]

const list2 = createLinkedList([1, 2]);
console.log(linkedListToArray(reverseList(list2))); // [2, 1]

const list3 = createLinkedList([]);
console.log(linkedListToArray(reverseList(list3))); // []
