const tree = {
  value: 1,
  left: { value: 2, left: null, right: { value: 4, left: null, right: null } },
  right: { value: 3, left: null, right: null },
};

const treeSum = (node) => {
  if (node === null) return 0;
  return node.value + treeSum(node.left) + treeSum(node.right);
};

console.log(treeSum(tree));
