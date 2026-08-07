const arr = [1, 7, 3, 7, 5];

const hasElemFrom = (arr, el, fromIndex) => arr.includes(el, fromIndex);

const result = hasElemFrom(arr, 7, 3);
console.log(result);
