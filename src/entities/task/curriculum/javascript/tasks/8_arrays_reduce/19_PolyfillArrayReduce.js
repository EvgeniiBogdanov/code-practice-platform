// Реализация полифила Array.prototype.reduce (myReduce)
// Реализуйте функцию customReduce(array, callback, initialValue).
//
// Требования:
// 1. Если initialValue не передан:
//    - Первым значением аккумулятора становится первый существующий элемент массива.
//    - Итерация начинается со следующего существующего элемента.
// 2. Если массив пуст и initialValue не передан — выбрасывает TypeError.
// 3. Если массив состоит из одного элемента без initialValue (или пуст с initialValue) — возвращает это значение без вызова callback.
// 4. Пустые слоты в разреженных массивах (sparse arrays) пропускаются.

const customReduce = (array, callback, initialValue) => {
  // Решение тут
};

// Пример вызова:
const sum = customReduce([1, 2, 3, 4], (acc, x) => acc + x, 0);
console.log(sum); // 10

const productNoInit = customReduce([2, 3, 4], (acc, x) => acc * x);
console.log(productNoInit); // 24

const sparseArr = [, , 10, , 20];
console.log(customReduce(sparseArr, (acc, x) => acc + x)); // 30
