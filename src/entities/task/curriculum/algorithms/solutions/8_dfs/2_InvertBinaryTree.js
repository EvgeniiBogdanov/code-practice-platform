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
console.log(treeToArray(invertTree(buildTree([4, 2, 7, 1, 3, 6, 9])))); // [4, 7, 2, 9, 6, 3, 1]
console.log(treeToArray(invertTree(buildTree([2, 1, 3]))));             // [2, 3, 1]
console.log(treeToArray(invertTree(buildTree([]))));                     // []
