const { createListNode, createLinkedList, linkedListToArray } = require('./helpers');

// Напишите функцию mergeTwoLists(list1, list2), которая принимает головы двух
// отсортированных по возрастанию односвязных списков: list1 и list2.
// Объедините эти два списка в один отсортированный список путем перенаправления связей узлов.
// Функция должна вернуть голову объединенного отсортированного списка.

const mergeTwoLists = (list1, list2) => {
  // Решение тут
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
