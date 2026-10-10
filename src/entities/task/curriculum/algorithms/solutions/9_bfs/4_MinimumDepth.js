const { buildTree } = require("./helpers");

const minDepth = (root) => {
  if (root === null) {
    return 0;
  }

  const queue = [[root, 1]];
  let head = 0;

  while (head < queue.length) {
    const [node, depth] = queue[head];
    head++;

    if (node.left === null && node.right === null) {
      return depth;
    }

    if (node.left !== null) {
      queue.push([node.left, depth + 1]);
    }

    if (node.right !== null) {
      queue.push([node.right, depth + 1]);
    }
  }

  return 0;
};

// Пример вызова:
console.log(minDepth(buildTree([7, 3, 9, 1, null, 8])));          // 3
console.log(minDepth(buildTree([4, 2, 6, null, null, 5])));       // 2
console.log(minDepth(buildTree([1, null, 2, null, 3, null, 4]))); // 4
console.log(minDepth(buildTree([])));                             // 0
