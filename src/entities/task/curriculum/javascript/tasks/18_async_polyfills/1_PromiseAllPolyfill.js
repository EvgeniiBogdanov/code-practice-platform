// Реализация полифила Promise.all
// Реализуйте функцию promiseAll(promises), которая возвращает промис, разрешающийся массивом результатов всех переданных промисов, либо отклоняющийся с первой ошибкой.

const promiseAll = (promises) => {
  // Решение тут
};

// Пример вызова:
promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  3,
]).then(console.log); // [1, 2, 3]
