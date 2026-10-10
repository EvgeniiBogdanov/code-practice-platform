// Напишите функцию minDepth(root), которая возвращает минимальную глубину бинарного
// дерева — число узлов на кратчайшем пути от корня до листа (узла без детей).
// У пустого дерева глубина 0.
//
// Обходите дерево по уровням (BFS) и остановитесь на первом же листе.
// В примерах деревья задаются массивами значений по уровням (null — нет узла).

const { buildTree } = require("./helpers");

const minDepth = (root) => {
  // Решение тут
};

// Пример вызова:
console.log(minDepth(buildTree([7, 3, 9, 1, null, 8])));          // 3
console.log(minDepth(buildTree([4, 2, 6, null, null, 5])));       // 2
console.log(minDepth(buildTree([1, null, 2, null, 3, null, 4]))); // 4
console.log(minDepth(buildTree([])));                             // 0
