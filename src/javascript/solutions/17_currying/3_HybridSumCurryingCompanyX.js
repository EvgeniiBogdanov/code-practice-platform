function sum(a) {
  let currentSum = a;

  function f(b) {
    currentSum += b;
    return f;
  }

  f[Symbol.toPrimitive] = () => currentSum;
  f.valueOf = () => currentSum;

  return f;
}

// Пример вызова:
console.log(Number(sum(1)(2)(3))); // 6
console.log(+sum(2)(4));           // 6
