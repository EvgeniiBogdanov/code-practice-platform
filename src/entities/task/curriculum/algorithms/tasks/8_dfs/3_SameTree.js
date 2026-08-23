const { buildTree } = require('./helpers');

// Напишите функцию isSameTree(p, q), которая принимает корни двух бинарных деревьев p и q
// и проверяет, являются ли они одинаковыми.
//
// Деревья считаются одинаковыми, если они структурно идентичны
// и все соответствующие узлы имеют одинаковые значения.

const isSameTree = (p, q) => {
  // Решение тут
};

// Пример вызова:
console.log(isSameTree(buildTree([1, 2, 3]), buildTree([1, 2, 3]))); // true
console.log(isSameTree(buildTree([1, 2]), buildTree([1, null, 2]))); // false
console.log(isSameTree(buildTree([1, 2, 1]), buildTree([1, 1, 2]))); // false
