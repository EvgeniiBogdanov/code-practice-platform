const tree = {
  value: 1,
  left: { value: 2, left: null, right: { value: 4, left: null, right: null } },
  right: { value: 3, left: null, right: null },
};

const treeDepth = (node) => {
  if (node === null) return 0;
  return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
};

console.log(treeDepth(tree));
