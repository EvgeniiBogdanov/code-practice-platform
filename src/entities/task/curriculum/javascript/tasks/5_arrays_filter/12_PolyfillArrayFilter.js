// Реализация полифила Array.prototype.filter (myFilter)
// Реализуйте функцию customFilter(array, callback, thisArg).
//
// Требования:
// 1. Пропуск пустых слотов в разреженных массивах (sparse arrays) без вызова callback.
// 2. Вызов callback(element, index, array) с привязкой thisArg при наличии.
// 3. Возвращает новый массив элементов, для которых callback вернул truthy значение.
// 4. Исходный массив не должен мутироваться.

const customFilter = (array, callback, thisArg) => {
  // Решение тут
};

// Пример вызова:
const numbers = [1, 2, 3, 4, 5, 6];
console.log(customFilter(numbers, (n) => n % 2 === 0)); // [ 2, 4, 6 ]

// Sparse array:
const sparseArr = [1, , 3, undefined, 5];
console.log(customFilter(sparseArr, (x) => x !== undefined)); // [ 1, 3, 5 ]

// thisArg:
const threshold = {
  min: 10,
  isValid(x) { return x >= this.min; },
};
console.log(customFilter([5, 12, 8, 20], function(x) { return this.isValid(x); }, threshold)); // [ 12, 20 ]
