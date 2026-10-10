// Напишите функцию invertTree(root), которая зеркально отражает бинарное дерево:
// у каждого узла левое и правое поддеревья меняются местами.
// Верните корень отражённого дерева.
//
// В примерах деревья задаются массивами значений по уровням (null — нет узла).

const { buildTree, treeToArray } = require('./helpers');

const invertTree = (root) => {
  // Решение тут
};

// Пример вызова:
console.log(treeToArray(invertTree(buildTree([5, 3, 8, 1, 4])))); // [5, 8, 3, null, null, 4, 1]
console.log(treeToArray(invertTree(buildTree([1, null, 2]))));    // [1, 2]
console.log(treeToArray(invertTree(buildTree([]))));              // []
