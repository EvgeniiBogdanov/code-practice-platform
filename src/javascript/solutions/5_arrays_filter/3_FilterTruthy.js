const values = [0, 1, false, 2, "", 3, null, undefined, NaN, 4];

const filterTruthy = (arr) => arr.filter(Boolean);

const result = filterTruthy(values);
console.log(result);
