// Собрать массив всех значений value из дерева
// Результат: [0, 1, 2, 3, 4, 5]

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
  // Ваш код здесь
};

console.log(recursionTree(tree));
