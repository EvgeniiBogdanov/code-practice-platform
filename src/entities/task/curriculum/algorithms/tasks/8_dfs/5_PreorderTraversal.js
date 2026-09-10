const { buildTree } = require("./helpers");

// Напишите функцию preorderTraversal(root), которая возвращает значения узлов
// бинарного дерева в порядке preorder: корень -> левое поддерево -> правое поддерево.

const preorderTraversal = (root) => {
  // Решение тут
};

// Пример вызова:
console.log(preorderTraversal(buildTree([1, null, 2, 3]))); // [1, 2, 3]
console.log(preorderTraversal(buildTree([1, 2, 3, 4, 5]))); // [1, 2, 4, 5, 3]
console.log(preorderTraversal(buildTree([]))); // []
