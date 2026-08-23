const { createListNode, createLinkedList, linkedListToArray } = require('./helpers');

const mergeTwoLists = (list1, list2) => {
  const dummy = createListNode(0);
  let current = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }

  if (list1 !== null) {
    current.next = list1;
  } else if (list2 !== null) {
    current.next = list2;
  }

  return dummy.next;
};

// Пример вызова:
const l1 = createLinkedList([1, 2, 4]);
const l2 = createLinkedList([1, 3, 4]);
console.log(linkedListToArray(mergeTwoLists(l1, l2))); // [1, 1, 2, 3, 4, 4]

const l3 = createLinkedList([]);
const l4 = createLinkedList([]);
console.log(linkedListToArray(mergeTwoLists(l3, l4))); // []

const l5 = createLinkedList([]);
const l6 = createLinkedList([0]);
console.log(linkedListToArray(mergeTwoLists(l5, l6))); // [0]
