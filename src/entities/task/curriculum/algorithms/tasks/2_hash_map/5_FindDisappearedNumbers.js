// Напишите функцию findDisappearedNumbers(nums), которая принимает массив из n чисел,
// где каждое значение лежит в диапазоне от 1 до n. Некоторые числа в этом диапазоне
// пропущены, а некоторые встречаются дважды.
//
// Функция должна вернуть массив всех пропущенных чисел из диапазона [1, n].
// Решите задачу за O(n) времени без дополнительной памяти (результирующий массив
// не считается), используя сам массив nums как хеш-таблицу.
//
// Примеры:
// findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1]) -> [5, 6]
// findDisappearedNumbers([1, 1])                   -> [2]
// findDisappearedNumbers([1, 2, 3])                -> []

const findDisappearedNumbers = (nums) => {
  // Решение тут
};

// Пример вызова:
console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // [5, 6]
console.log(findDisappearedNumbers([1, 1]));                   // [2]
console.log(findDisappearedNumbers([1, 2, 3]));                // []
