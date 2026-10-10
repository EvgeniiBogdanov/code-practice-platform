// В массиве nums — изменения баланса счёта по дням. Аналитикам нужно много раз
// узнавать, на сколько изменился баланс за период.
//
// Напишите функцию createNumArray(nums), которая один раз подготавливает данные
// за O(n) и возвращает объект с методом sumRange(left, right): сумма элементов
// nums с индекса left по right включительно (left <= right).
// Каждый вызов sumRange должен работать за O(1).

const createNumArray = (nums) => {
  // Решение тут
};

// Пример вызова:
const balance = createNumArray([4, -1, 3, 0, 5, -2]);
console.log(balance.sumRange(1, 3)); // 2
console.log(balance.sumRange(0, 5)); // 9
console.log(balance.sumRange(4, 4)); // 5
