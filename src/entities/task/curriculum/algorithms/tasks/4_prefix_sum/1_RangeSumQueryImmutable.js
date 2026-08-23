// Напишите функцию createNumArray(nums), которая принимает массив целых чисел (nums)
// и возвращает объект с методом sumRange(left, right).
// Метод sumRange должен возвращать сумму элементов массива nums между индексами
// left и right включительно (left <= right).
//
// Ограничение:
// Метод sumRange может вызываться очень часто (тысячи раз), поэтому
// он должен вычислять сумму максимально быстро — за фиксированное время O(1).
//
// Примеры:
// const numArray = createNumArray([-2, 0, 3, -5, 2, -1]);
// numArray.sumRange(0, 2); // 1  (так как -2 + 0 + 3 = 1)
// numArray.sumRange(2, 5); // -1 (так как 3 + (-5) + 2 + (-1) = -1)
// numArray.sumRange(0, 5); // -3 (так как -2 + 0 + 3 + (-5) + 2 + (-1) = -3)

const createNumArray = (nums) => {
  // Решение тут
};

// Пример вызова:
const numArray = createNumArray([-2, 0, 3, -5, 2, -1]);
console.log(numArray.sumRange(0, 2)); // 1
console.log(numArray.sumRange(2, 5)); // -1
console.log(numArray.sumRange(0, 5)); // -3
