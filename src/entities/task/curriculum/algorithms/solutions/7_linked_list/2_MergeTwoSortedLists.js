const { createListNode, createLinkedList, linkedListToArray } = require('./helpers');

const mergeTwoLists = (list1, list2) => {
  const dummy = createListNode(0);
  let current = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
      current = current.next;
      continue;
    }

    current.next = list2;
    list2 = list2.next;
    current = current.next;
  }

  if (list1 !== null) {
    current.next = list1;
  }

  if (list2 !== null) {
    current.next = list2;
  }

  return dummy.next;
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
