// Напишите функцию preorderTraversal(root), которая возвращает значения узлов
// бинарного дерева в прямом порядке (preorder): сначала узел, потом его левое
// поддерево, потом правое.
//
// В примерах деревья задаются массивами значений по уровням (null — нет узла).

const { buildTree } = require("./helpers");

// Напишите функцию preorderTraversal(root), которая возвращает значения узлов
// бинарного дерева в порядке preorder: корень -> левое поддерево -> правое поддерево.

const preorderTraversal = (root) => {
  // Решение тут
};

// Пример вызова:
console.log(preorderTraversal(buildTree([6, 2, 8, 1, 4]))); // [6, 2, 1, 4, 8]
console.log(preorderTraversal(buildTree([3, null, 5, 4]))); // [3, 5, 4]
console.log(preorderTraversal(buildTree([])));              // []
