/**
 * Решение задачи: Вспомогательная функция classNames
 */
function classNames(...args) {
  const classes = [];

  for (const arg of args) {
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classNames(...arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === 'object') {
      if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
        classes.push(arg.toString());
        continue;
      }

      for (const key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

// Примеры использования:
console.log(classNames('foo', 'bar')); // 'foo bar'
console.log(classNames('foo', { bar: true, duck: false })); // 'foo bar'
console.log(classNames({ 'foo-bar': true }, { 'foo-bar': false })); // 'foo-bar'
console.log(classNames('foo', { bar: true }, ['baz', { nested: true }])); // 'foo bar baz nested'
console.log(classNames(null, false, 'bar', undefined, 0, 1, NaN, '')); // 'bar 1'
