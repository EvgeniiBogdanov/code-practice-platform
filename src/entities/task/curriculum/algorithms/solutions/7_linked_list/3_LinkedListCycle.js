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
const list1 = createLinkedListWithCycle([3, 2, 0, -4], 1);
console.log(hasCycle(list1)); // true

const list2 = createLinkedListWithCycle([1, 2], 0);
console.log(hasCycle(list2)); // true

const list3 = createLinkedListWithCycle([1], -1);
console.log(hasCycle(list3)); // false
