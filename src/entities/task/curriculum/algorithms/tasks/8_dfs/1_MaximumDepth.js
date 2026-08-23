const { buildTree } = require('./helpers');

// Напишите функцию maxDepth(root), которая принимает корень бинарного дерева (root)
// и возвращает его максимальную глубину.
//
// Максимальная глубина — это количество узлов вдоль самого длинного пути
// от корневого узла до самого дальнего листового узла.

const maxDepth = (root) => {
  // Решение тут
};

// Пример вызова:
const tree1 = buildTree([3, 9, 20, null, null, 15, 7]);
console.log(maxDepth(tree1)); // 3

const tree2 = buildTree([1, null, 2]);
console.log(maxDepth(tree2)); // 2

const tree3 = buildTree([]);
console.log(maxDepth(tree3)); // 0
