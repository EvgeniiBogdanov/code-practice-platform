// Вспомогательные функции — НЕ часть задач с LeetCode.
// Эти функции нужны для удобной работы со структурами данных (деревья, списки) локально в Node.js и песочнице.

// --- Binary Tree Helpers ---
const createNode = (val = 0, left = null, right = null) => ({ val, left, right });
const createTreeNode = createNode;

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

  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }

  return result;
};

// --- Linked List Helpers ---
const createListNode = (val = 0, next = null) => ({ val, next });

const createLinkedList = (arr) => {
  if (!arr || arr.length === 0) return null;
  return arr.reduceRight((acc, val) => createNode(val, acc), null);
};

const linkedListToArray = (head) => {
  const result = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
};

const printLinkedList = linkedListToArray;

const createLinkedListWithCycle = (arr, pos) => {
  if (!arr || arr.length === 0) return null;

  const nodes = arr.map((val) => createNode(val));
  nodes.forEach((node, index) => {
    if (index < nodes.length - 1) {
      node.next = nodes[index + 1];
    }
  });

  if (pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }

  return nodes[0];
};

const createListWithCycle = createLinkedListWithCycle;

module.exports = {
  createNode,
  createTreeNode,
  buildTree,
  treeToArray,
  createListNode,
  createLinkedList,
  linkedListToArray,
  printLinkedList,
  createLinkedListWithCycle,
  createListWithCycle,
};
