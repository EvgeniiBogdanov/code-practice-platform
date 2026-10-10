const climbStairs = (n) => {
  // ways(step) = ways(step - 1) + ways(step - 2); храним только два последних значения
  let previous = 1; // способов добраться до ступеньки 0
  let current = 1;  // способов добраться до ступеньки 1

  for (let step = 2; step <= n; step++) {
    [previous, current] = [current, previous + current];
  }

  return current;
};

// Пример вызова:
console.log(climbStairs(4));  // 5
console.log(climbStairs(6));  // 13
console.log(climbStairs(10)); // 89
