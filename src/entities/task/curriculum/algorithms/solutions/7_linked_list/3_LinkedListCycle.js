const { createLinkedListWithCycle } = require('./helpers');

const hasCycle = (head) => {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
};

// Пример вызова:
const list1 = createLinkedListWithCycle([5, 8, 1, 7], 2);
console.log(hasCycle(list1)); // true

const list2 = createLinkedListWithCycle([9, 4], 1);
console.log(hasCycle(list2)); // true

const list3 = createLinkedListWithCycle([6, 2, 3], -1);
console.log(hasCycle(list3)); // false
