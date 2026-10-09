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
const playlist1 = createLinkedList([10, 20, 30]);
console.log(linkedListToArray(reverseList(playlist1))); // [30, 20, 10]

const playlist2 = createLinkedList([7]);
console.log(linkedListToArray(reverseList(playlist2))); // [7]

const playlist3 = createLinkedList([]);
console.log(linkedListToArray(reverseList(playlist3))); // []
