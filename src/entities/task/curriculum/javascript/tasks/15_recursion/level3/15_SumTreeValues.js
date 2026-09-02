// Сумма значений в N-арном дереве
// Напишите функцию sumTree(data), суммирующую значения всех узлов дерева.

const tree = {
  value: 1,
  children: [
    {
      value: 2,
      children: [{ value: 4 }, { value: 5 }],
    },
    {
      value: 3,
      children: [{ value: 6 }, { value: 7 }],
    },
  ],
};

const sumTree = (data) => {
  // Решение тут
};

// Пример вызова:
console.log(sumTree(tree)); // 28
