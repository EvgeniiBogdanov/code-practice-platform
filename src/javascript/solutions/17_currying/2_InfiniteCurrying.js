function curry_sum(x) {
  const fn = (y) => {
    if (y === undefined) {
      return x;
    }

    return curry_sum(x + y);
  };

  return fn;
}

console.log(curry_sum(1)()); // 1
console.log(curry_sum(1)(2)(3)()); // 6
console.log(curry_sum(2)(11)(11)()); // 24
