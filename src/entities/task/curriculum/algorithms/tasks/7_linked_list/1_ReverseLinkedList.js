// Плейлист хранится как односвязный список: каждый трек знает только следующий.
// Напишите функцию reverseList(head), которая разворачивает список на месте,
// перенаправляя ссылки next, и возвращает новую голову.

const { createLinkedList, linkedListToArray } = require('./helpers');

const reverseList = (head) => {
  // Решение тут
};

// Пример вызова:
const playlist1 = createLinkedList([10, 20, 30]);
console.log(linkedListToArray(reverseList(playlist1))); // [30, 20, 10]

const playlist2 = createLinkedList([7]);
console.log(linkedListToArray(reverseList(playlist2))); // [7]

const playlist3 = createLinkedList([]);
console.log(linkedListToArray(reverseList(playlist3))); // []
