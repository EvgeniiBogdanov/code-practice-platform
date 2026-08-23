// Обход односвязного списка
// Напишите функцию sumLinkedList(head), которая принимает голову (head)
// односвязного списка и возвращает сумму значений всех узлов с помощью цикла while.

const sumLinkedList = (head) => {
  // Решение тут
};

const list = {
  value: 10,
  next: {
    value: 20,
    next: {
      value: 30,
      next: null,
    },
  },
};

// Пример вызова:
console.log(sumLinkedList(list)); // 60
console.log(sumLinkedList(null)); // 0
