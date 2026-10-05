// Реализация полифила Array.prototype.flat
// Реализуйте метод Array.prototype.myFlat(depth = 1), который работает как встроенный flat:
// - убирает вложенность до глубины depth (Infinity — полностью)
// - не изменяет исходный массив
// - пропускает «дыры» разреженных массивов ([1, , 3])

Array.prototype.myFlat = function (depth = 1) {
  // Решение тут
};

// Пример вызова:
const nested = [1, [2, [3, [4]]], 5];
console.log(nested.myFlat()); // [1, 2, [3, [4]], 5]
console.log(nested.myFlat(2)); // [1, 2, 3, [4], 5]
console.log(nested.myFlat(Infinity)); // [1, 2, 3, 4, 5]
console.log(nested.myFlat(0)); // [1, [2, [3, [4]]], 5]
console.log([1, , 3, [4, , 6]].myFlat()); // [1, 3, 4, 6]
console.log(nested); // [1, [2, [3, [4]]], 5] — исходный массив не изменился
