const { buildTree } = require('./helpers');

const maxDepth = (root) => {
  if (root === null) {
    return 0;
  }

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return Math.max(leftDepth, rightDepth) + 1;
};

// Пример вызова:
const tree1 = buildTree([3, 9, 20, null, null, 15, 7]);
console.log(maxDepth(tree1)); // 3

const tree2 = buildTree([1, null, 2]);
console.log(maxDepth(tree2)); // 2

const tree3 = buildTree([]);
console.log(maxDepth(tree3)); // 0
