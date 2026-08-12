const { buildTree } = require('./helpers');

const diameterOfBinaryTree = (root) => {
  let diameter = 0;

  const height = (node) => {
    if (node === null) {
      return 0;
    }

    const leftHeight = height(node.left);
    const rightHeight = height(node.right);

    diameter = Math.max(diameter, leftHeight + rightHeight);

    return Math.max(leftHeight, rightHeight) + 1;
  };

  height(root);
  return diameter;
};

// Пример вызова:
const tree1 = buildTree([1, 2, 3, 4, 5]);
console.log(diameterOfBinaryTree(tree1)); // 3

const tree2 = buildTree([1, 2]);
console.log(diameterOfBinaryTree(tree2)); // 1

const tree3 = buildTree([]);
console.log(diameterOfBinaryTree(tree3)); // 0
