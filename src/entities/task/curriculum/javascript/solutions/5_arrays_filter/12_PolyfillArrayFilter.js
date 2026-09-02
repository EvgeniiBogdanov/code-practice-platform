const customFilter = (array, callback, thisArg) => {
  if (array === null || array === undefined) {
    throw new TypeError("customFilter called on null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }

  const obj = Object(array);
  const len = obj.length >>> 0;
  const result = [];

  for (let i = 0; i < len; i++) {
    if (i in obj) {
      const element = obj[i];
      if (Boolean(callback.call(thisArg, element, i, obj))) {
        result.push(element);
      }
    }
  }

  return result;
};

// Пример вызова:
const numbers = [1, 2, 3, 4, 5, 6];
console.log(customFilter(numbers, (n) => n % 2 === 0)); // [ 2, 4, 6 ]

// Sparse array:
const sparseArr = [1, , 3, undefined, 5];
console.log(customFilter(sparseArr, (x) => x !== undefined)); // [ 1, 3, 5 ] (пустой слот пропущен)

// thisArg:
const threshold = {
  min: 10,
  isValid(x) { return x >= this.min; },
};
console.log(customFilter([5, 12, 8, 20], function(x) { return this.isValid(x); }, threshold)); // [ 12, 20 ]
