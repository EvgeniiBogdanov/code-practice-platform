const { buildTree, treeToArray } = require('./helpers');

const invertTree = (root) => {
  if (root === null) {
    return null;
  }

  const left = invertTree(root.left);
  const right = invertTree(root.right);

  root.left = right;
  root.right = left;

  return root;
};

// Пример вызова:
console.log(treeToArray(invertTree(buildTree([5, 3, 8, 1, 4])))); // [5, 8, 3, null, null, 4, 1]
console.log(treeToArray(invertTree(buildTree([1, null, 2]))));    // [1, 2]
console.log(treeToArray(invertTree(buildTree([]))));              // []
