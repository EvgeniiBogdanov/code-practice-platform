const { buildTree } = require("./helpers");

// Напишите функцию minDepth(root), которая возвращает минимальную глубину
// бинарного дерева: количество узлов от корня до ближайшего листа.
// Используйте BFS и завершите обход при встрече первого листа.

const minDepth = (root) => {
  // Решение тут
};

// Пример вызова:
console.log(minDepth(buildTree([3, 9, 20, null, null, 15, 7]))); // 2
console.log(minDepth(buildTree([2, null, 3, null, 4]))); // 3
console.log(minDepth(buildTree([]))); // 0
