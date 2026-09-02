const customReduce = (array, callback, ...initialArgs) => {
  if (array === null || array === undefined) {
    throw new TypeError("customReduce called on null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }

  const obj = Object(array);
  const len = obj.length >>> 0;
  const hasInitial = initialArgs.length > 0;
  let accumulator = initialArgs[0];
  let startIndex = 0;

  if (!hasInitial) {
    let found = false;
    for (let i = 0; i < len; i++) {
      if (i in obj) {
        accumulator = obj[i];
        startIndex = i + 1;
        found = true;
        break;
      }
    }
    if (!found) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
  }

  for (let i = startIndex; i < len; i++) {
    if (i in obj) {
      accumulator = callback(accumulator, obj[i], i, obj);
    }
  }

  return accumulator;
};

// Пример вызова:
const sum = customReduce([1, 2, 3, 4], (acc, x) => acc + x, 0);
console.log(sum); // 10

const productNoInit = customReduce([2, 3, 4], (acc, x) => acc * x);
console.log(productNoInit); // 24

// Разреженный массив без initialValue:
const sparseArr = [, , 10, , 20];
console.log(customReduce(sparseArr, (acc, x) => acc + x)); // 30 (аккумулятор = 10, первый шаг = 20)

// Ошибка на пустом массиве без initialValue:
try {
  customReduce([], (acc, x) => acc + x);
} catch (e) {
  console.log(e.name); // 'TypeError'
}
