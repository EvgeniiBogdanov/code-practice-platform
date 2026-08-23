const { createLinkedListWithCycle } = require('./helpers');

// Напишите функцию hasCycle(head), которая определяет, есть ли в односвязном списке цикл.
//
// В связном списке есть цикл, если по ссылкам next можно ходить бесконечно,
// то есть какой-то узел ссылается на один из ранее посещенных узлов списка.
//
// Функция должна возвращать true, если цикл есть, и false, если цикла нет.

const hasCycle = (head) => {
  // Решение тут
};

// Пример вызова:
const list1 = createLinkedListWithCycle([3, 2, 0, -4], 1);
console.log(hasCycle(list1)); // true

const list2 = createLinkedListWithCycle([1, 2], 0);
console.log(hasCycle(list2)); // true

const list3 = createLinkedListWithCycle([1], -1);
console.log(hasCycle(list3)); // false
