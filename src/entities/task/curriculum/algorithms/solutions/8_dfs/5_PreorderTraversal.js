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
console.log(preorderTraversal(buildTree([1, null, 2, 3]))); // [1, 2, 3]
console.log(preorderTraversal(buildTree([1, 2, 3, 4, 5]))); // [1, 2, 4, 5, 3]
console.log(preorderTraversal(buildTree([]))); // []
