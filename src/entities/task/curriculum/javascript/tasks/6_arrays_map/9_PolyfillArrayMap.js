// Реализация полифила Array.prototype.map (myMap)
// Реализуйте функцию customMap(array, callback, thisArg).
//
// Требования:
// 1. Если array равен null или undefined — выбрасывает TypeError.
// 2. Если callback не является функцией — выбрасывает TypeError.
// 3. Возвращает новый массив той же длины, где для существующих индексов вычислен результат callback.call(thisArg, array[i], i, array).
// 4. Сохраняет пропуски в разреженных массивах (sparse arrays).

const customMap = (array, callback, thisArg) => {
  // Решение тут
};

// Пример вызова:
const nums = [1, 2, 3, 4];
console.log(customMap(nums, (x) => x * 2)); // [ 2, 4, 6, 8 ]

// Sparse array:
const sparse = [1, , 3];
const mappedSparse = customMap(sparse, (x) => x * 10);
console.log(mappedSparse); // [ 10, <empty>, 30 ]

// thisArg:
const multiplier = {
  factor: 3,
  multiply(x) {
    return x * this.factor;
  },
};
console.log(customMap([2, 5], function(x) { return this.multiply(x); }, multiplier)); // [ 6, 15 ]
