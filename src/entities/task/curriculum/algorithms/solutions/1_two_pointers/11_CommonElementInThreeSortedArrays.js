const findCommonElement = (a, b, c) => {
  let i = 0;
  let j = 0;
  let k = 0;

  while (i < a.length && j < b.length && k < c.length) {
    if (a[i] === b[j] && b[j] === c[k]) {
      // Массивы неубывающие, поэтому первое найденное совпадение — наименьшее
      return a[i];
    }

    // Значения, меньшие текущего максимума, не могут быть общими: их пропускаем
    const max = Math.max(a[i], b[j], c[k]);
    if (a[i] < max) i++;
    if (b[j] < max) j++;
    if (c[k] < max) k++;
  }

  return null;
};

// Пример вызова:
console.log(findCommonElement([1, 2, 4, 5], [3, 3, 4], [2, 3, 4, 5, 6])); // 4
console.log(findCommonElement([1, 2, 3], [4, 5], [6]));                   // null
console.log(findCommonElement([1, 1, 2], [1, 2, 2], [1, 1, 2, 2]));       // 1
