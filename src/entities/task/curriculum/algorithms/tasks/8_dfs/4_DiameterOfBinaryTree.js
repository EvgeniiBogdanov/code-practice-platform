const { buildTree } = require('./helpers');

// Напишите функцию diameterOfBinaryTree(root), которая принимает корень бинарного дерева (root)
// и возвращает диаметр этого дерева.
//
// Диаметр бинарного дерева — это длина самого длинного пути между любыми двумя узлами дерева.
// Этот путь может проходить через корень, а может и не проходить через него.
// Длина пути определяется количеством рёбер между узлами.

const diameterOfBinaryTree = (root) => {
  // Решение тут
};

// Пример вызова:
const tree1 = buildTree([1, 2, 3, 4, 5]);
console.log(diameterOfBinaryTree(tree1)); // 3

const tree2 = buildTree([1, 2]);
console.log(diameterOfBinaryTree(tree2)); // 1

const tree3 = buildTree([]);
console.log(diameterOfBinaryTree(tree3)); // 0
