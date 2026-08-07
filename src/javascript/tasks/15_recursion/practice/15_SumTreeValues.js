// Просуммировать все свойства value в дереве
// Результат: 28

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
  // Ваш код здесь
};

console.log(sumTree(tree));
