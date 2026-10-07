const symmetricDifference = (a, b) => {
  const result = [];

  // Результат строится по возрастанию, поэтому дубликат — всегда последний элемент
  const pushUnique = (value) => {
    if (result.length === 0 || result[result.length - 1] !== value) {
      result.push(value);
    }
  };

  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      // Общее значение пропускаем целиком в обоих массивах, включая повторы
      const common = a[i];
      while (i < a.length && a[i] === common) i++;
      while (j < b.length && b[j] === common) j++;
    } else if (a[i] < b[j]) {
      pushUnique(a[i++]);
    } else {
      pushUnique(b[j++]);
    }
  }

  // Хвост того массива, который не закончился, содержит только «свои» значения
  while (i < a.length) pushUnique(a[i++]);
  while (j < b.length) pushUnique(b[j++]);

  return result;
};

// Пример вызова:
console.log(symmetricDifference([1, 2, 3, 5], [2, 3, 4, 6])); // [1, 4, 5, 6]
console.log(symmetricDifference([1, 1, 2], [2, 3, 3]));       // [1, 3]
console.log(symmetricDifference([], [1, 2]));                 // [1, 2]
console.log(symmetricDifference([1, 2], [1, 2]));             // []
