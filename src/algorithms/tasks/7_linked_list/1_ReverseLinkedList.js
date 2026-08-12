const { createLinkedList, linkedListToArray } = require('./helpers');

// Напишите функцию reverseList(head), которая принимает голову односвязного списка (head)
// и разворачивает список задом наперёд.
// Функция должна вернуть новую голову развёрнутого списка.

const reverseList = (head) => {
  // Решение тут
};

// Пример вызова:
const list1 = createLinkedList([1, 2, 3, 4, 5]);
console.log(linkedListToArray(reverseList(list1))); // [5, 4, 3, 2, 1]

const list2 = createLinkedList([1, 2]);
console.log(linkedListToArray(reverseList(list2))); // [2, 1]

const list3 = createLinkedList([]);
console.log(linkedListToArray(reverseList(list3))); // []
