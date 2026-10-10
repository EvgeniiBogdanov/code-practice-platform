const { buildTree } = require("./helpers");

const preorderTraversal = (root) => {
  const values = [];

  const dfs = (node) => {
    if (node === null) {
      return;
    }

    values.push(node.val);
    dfs(node.left);
    dfs(node.right);
  };

  dfs(root);
  return values;
};

// Пример вызова:
console.log(preorderTraversal(buildTree([6, 2, 8, 1, 4]))); // [6, 2, 1, 4, 8]
console.log(preorderTraversal(buildTree([3, null, 5, 4]))); // [3, 5, 4]
console.log(preorderTraversal(buildTree([])));              // []
