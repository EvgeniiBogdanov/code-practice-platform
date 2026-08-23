// Сбор значений из дерева с произвольным числом потомков (N-ary Tree)
// Напишите функцию recursionTree(data), собирающую массив значений дерева.

const tree = {
  value: 0,
  children: [
    {
      value: 1,
      children: [{ value: 2 }],
    },
    {
      value: 3,
      children: [{ value: 4 }, { value: 5 }],
    },
  ],
};

const recursionTree = (data) => {
  // Решение тут
};

// Пример вызова:
console.log(recursionTree(tree)); // [0, 1, 2, 3, 4, 5]
