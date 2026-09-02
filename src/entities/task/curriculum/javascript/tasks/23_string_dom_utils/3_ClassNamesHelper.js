// Вспомогательная функция объединения CSS-классов (classNames / clsx)
// Напишите функцию classNames(...args), которая объединяет переданные классы в одну строку, фильтруя falsy-значения.

const classNames = (...args) => {
  // Решение тут
};

// Пример вызова:
console.log(classNames("foo", "bar"));                                     // "foo bar"
console.log(classNames("foo", { bar: true, duck: false }));                // "foo bar"
console.log(classNames("foo", { bar: true }, ["baz", { nested: true }])); // "foo bar baz nested"
console.log(classNames(null, false, "bar", undefined, 0, 1, NaN, ""));     // "bar 1"
