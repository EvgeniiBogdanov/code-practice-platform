// Итеративный вариант со стеком: не упирается в лимит глубины рекурсии
Array.prototype.myFlat = function (depth = 1) {
  const stack = [];
  // Кладём элементы в стек с конца, чтобы снимать их в исходном порядке
  for (let i = this.length - 1; i >= 0; i--) {
    if (i in this) {
      stack.push([this[i], depth]);
    }
  }

  const result = [];
  while (stack.length > 0) {
    const [item, itemDepth] = stack.pop();

    if (Array.isArray(item) && itemDepth > 0) {
      for (let i = item.length - 1; i >= 0; i--) {
        if (i in item) {
          stack.push([item[i], itemDepth - 1]);
        }
      }
    } else {
      result.push(item);
    }
  }

  return result;
};

// Пример вызова:
const nested = [1, [2, [3, [4]]], 5];
console.log(nested.myFlat()); // [1, 2, [3, [4]], 5]
console.log(nested.myFlat(2)); // [1, 2, 3, [4], 5]
console.log(nested.myFlat(Infinity)); // [1, 2, 3, 4, 5]
console.log(nested.myFlat(0)); // [1, [2, [3, [4]]], 5]
console.log([1, , 3, [4, , 6]].myFlat()); // [1, 3, 4, 6]
console.log(nested); // [1, [2, [3, [4]]], 5]
