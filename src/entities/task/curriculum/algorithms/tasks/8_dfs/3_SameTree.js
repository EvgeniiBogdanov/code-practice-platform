// Напишите функцию isSameTree(p, q), которая проверяет, совпадают ли два бинарных
// дерева: одинаковая форма и одинаковые значения в соответствующих узлах.
//
// В примерах деревья задаются массивами значений по уровням (null — нет узла).

const { buildTree } = require('./helpers');

const isSameTree = (p, q) => {
  // Решение тут
};

// Пример вызова:
console.log(isSameTree(buildTree([4, 2, 6]), buildTree([4, 2, 6]))); // true
console.log(isSameTree(buildTree([4, 2]), buildTree([4, null, 2]))); // false
console.log(isSameTree(buildTree([4, 2, 6]), buildTree([4, 6, 2]))); // false
