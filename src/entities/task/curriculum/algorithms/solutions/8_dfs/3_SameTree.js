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
console.log(isSameTree(buildTree([4, 2, 6]), buildTree([4, 2, 6]))); // true
console.log(isSameTree(buildTree([4, 2]), buildTree([4, null, 2]))); // false
console.log(isSameTree(buildTree([4, 2, 6]), buildTree([4, 6, 2]))); // false
