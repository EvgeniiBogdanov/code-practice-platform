// Вспомогательные функции — НЕ часть задачи с LeetCode.
// На самом LeetCode дерево уже собрано системой тестирования,
// и тебе не нужно писать код для его построения/вывода.
// Эти функции нужны только чтобы удобно гонять решение локально в Node.js.

const createNode = (val = 0, left = null, right = null) => ({ val, left, right });
const createTreeNode = createNode;

// Строит дерево из массива в "level order" формате (как на LeetCode),
// где null означает отсутствующего потомка.
const buildTree = (values) => {
  if (!values || values.length === 0) {
    return null;
  }

  const root = createNode(values[0]);
  const queue = [root];
  let i = 1;

  while (i < values.length) {
    const current = queue.shift();

    const leftVal = values[i];
    i += 1;
    if (leftVal !== null && leftVal !== undefined) {
      current.left = createNode(leftVal);
      queue.push(current.left);
    }

    if (i < values.length) {
      const rightVal = values[i];
      i += 1;
      if (rightVal !== null && rightVal !== undefined) {
        current.right = createNode(rightVal);
        queue.push(current.right);
      }
    }
  }

  return root;
};

// Превращает дерево обратно в плоский массив (level order) для удобной сверки в console.log.
const treeToArray = (root) => {
  if (root === null) {
    return [];
  }

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();

    if (node === null) {
      result.push(null);
    }
    if (node !== null) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }

  while (result[result.length - 1] === null) {
    result.pop();
  }

  return result;
};

module.exports = { createNode, createTreeNode, buildTree, treeToArray };
