const customMap = (array, callback, thisArg) => {
  if (array === null || array === undefined) {
    throw new TypeError("customMap called on null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }

  const obj = Object(array);
  const len = obj.length >>> 0;
  const result = new Array(len);

  for (let i = 0; i < len; i++) {
    if (i in obj) {
      result[i] = callback.call(thisArg, obj[i], i, obj);
    }
  }

  return result;
};

// Пример вызова:
const nums = [1, 2, 3, 4];
console.log(customMap(nums, (x) => x * 2)); // [ 2, 4, 6, 8 ]

// Sparse array (разреженный массив с дырой):
const sparse = [1, , 3];
const mappedSparse = customMap(sparse, (x) => x * 10);
console.log(mappedSparse); // [ 10, <empty>, 30 ]
console.log(1 in mappedSparse); // false (дыра сохранена!)

// Проверка thisArg:
const multiplier = {
  factor: 3,
  multiply(x) {
    return x * this.factor;
  },
};
console.log(customMap([2, 5], function(x) { return this.multiply(x); }, multiplier)); // [ 6, 15 ]
