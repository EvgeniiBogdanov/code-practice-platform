const { buildTree, treeToArray } = require('./helpers');

// Напишите функцию invertTree(root), которая принимает корень бинарного дерева (root)
// и отражает его зеркально (инвертирует).
//
// Функция должна менять местами левое и правое поддеревья для каждого узла
// и возвращать корень инвертированного дерева.

const invertTree = (root) => {
  // Решение тут
};

// Пример вызова:
console.log(treeToArray(invertTree(buildTree([4, 2, 7, 1, 3, 6, 9])))); // [4, 7, 2, 9, 6, 3, 1]
console.log(treeToArray(invertTree(buildTree([2, 1, 3]))));             // [2, 3, 1]
console.log(treeToArray(invertTree(buildTree([]))));                     // []
