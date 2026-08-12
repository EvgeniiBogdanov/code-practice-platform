const { buildTree } = require('./helpers');

const isSameTree = (p, q) => {
  if (p === null && q === null) {
    return true;
  }

  if (p === null || q === null) {
    return false;
  }

  if (p.val !== q.val) {
    return false;
  }

  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};

// Пример вызова:
console.log(isSameTree(buildTree([1, 2, 3]), buildTree([1, 2, 3]))); // true
console.log(isSameTree(buildTree([1, 2]), buildTree([1, null, 2]))); // false
console.log(isSameTree(buildTree([1, 2, 1]), buildTree([1, 1, 2]))); // false
