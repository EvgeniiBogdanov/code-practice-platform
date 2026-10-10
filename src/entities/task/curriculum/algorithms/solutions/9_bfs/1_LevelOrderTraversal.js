const { buildTree } = require('./helpers');

const levelOrder = (root) => {
  const levels = [];

  if (root === null) {
    return levels;
  }

  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i += 1) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left !== null) {
        queue.push(node.left);
      }
      if (node.right !== null) {
        queue.push(node.right);
      }
    }

    levels.push(currentLevel);
  }

  return levels;
};

// Пример вызова:
console.log(levelOrder(buildTree([10, 6, 15, 3, 8, null, 20]))); // [[10], [6, 15], [3, 8, 20]]
console.log(levelOrder(buildTree([5, null, 7])));                // [[5], [7]]
console.log(levelOrder(buildTree([])));                          // []
