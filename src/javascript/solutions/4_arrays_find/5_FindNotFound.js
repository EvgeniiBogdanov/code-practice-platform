// В массиве нет чётных чисел → вернётся undefined
const arr = [1, 3, 5, 7];
const result = arr.find((num) => num % 2 === 0);

console.log(result); // undefined
