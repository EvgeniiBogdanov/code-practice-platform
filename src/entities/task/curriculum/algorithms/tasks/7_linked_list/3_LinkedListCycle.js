// Напишите функцию hasCycle(head), которая проверяет, зациклен ли односвязный список:
// если, двигаясь по ссылкам next, можно бесконечно возвращаться к уже пройденным
// узлам, верните true, иначе — false.
//
// Дополнительная память — O(1).
//
// В примерах список собирает createLinkedListWithCycle(values, pos): последний узел
// ссылается на узел с индексом pos (-1 — цикла нет). Само значение pos функции
// hasCycle не передаётся.

const { createLinkedListWithCycle } = require('./helpers');

const hasCycle = (head) => {
  // Решение тут
};

// Пример вызова:
const list1 = createLinkedListWithCycle([5, 8, 1, 7], 2);
console.log(hasCycle(list1)); // true

const list2 = createLinkedListWithCycle([9, 4], 1);
console.log(hasCycle(list2)); // true

const list3 = createLinkedListWithCycle([6, 2, 3], -1);
console.log(hasCycle(list3)); // false
