/**
 * Напишите функцию classNames(...args), которая утилитарно объединяет имена CSS-классов.
 * Аналог популярной библиотеки `classnames` / `clsx`.
 *
 * Подгруппа: CSS утилиты
 *
 * Требования:
 * - Принимает произвольное количество аргументов (строки, числа, объекты, массивы)
 * - Игнорирует ложные значения (false, null, undefined, 0, NaN, '')
 * - Если аргумент — строка или число, добавляет его в результат
 * - Если аргумент — объект, добавляет ключи, значения которых истинны (truthy)
 * - Если аргумент — массив, рекурсивно обрабатывает все его элементы
 * - Возвращает единую строку с классами, разделенными пробелом
 *
 * @param  {...any} args
 * @returns {string}
 */
function classNames(...args) {
  // Ваш код здесь
}

// Примеры использования:
console.log(classNames('foo', 'bar')); // 'foo bar'
console.log(classNames('foo', { bar: true, duck: false })); // 'foo bar'
console.log(classNames({ 'foo-bar': true }, { 'foo-bar': false })); // 'foo-bar'
console.log(classNames('foo', { bar: true }, ['baz', { nested: true }])); // 'foo bar baz nested'
console.log(classNames(null, false, 'bar', undefined, 0, 1, NaN, '')); // 'bar 1'
