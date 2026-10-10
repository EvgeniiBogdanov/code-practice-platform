// Напишите функцию maxDepth(root), которая возвращает глубину бинарного дерева —
// число узлов на самом длинном пути от корня до листа. У пустого дерева глубина 0.
//
// В примерах дерево собирает buildTree из массива значений по уровням
// (null — отсутствующий узел).

const { buildTree } = require('./helpers');

const maxDepth = (root) => {
  // Решение тут
};

// Пример вызова:
const tree1 = buildTree([8, 4, 12, null, 6, 10, null, 5]);
console.log(maxDepth(tree1)); // 4

const tree2 = buildTree([1, 2]);
console.log(maxDepth(tree2)); // 2

const tree3 = buildTree([]);
console.log(maxDepth(tree3)); // 0
