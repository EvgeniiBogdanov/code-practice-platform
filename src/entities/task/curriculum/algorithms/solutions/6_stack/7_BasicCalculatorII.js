const calculate = (s) => {
  // Стек слагаемых: "*" и "/" сразу применяются к верхнему слагаемому,
  // а "+" и "-" кладут новое слагаемое со своим знаком
  const stack = [];
  let number = 0;
  let operator = "+";

  // i === s.length даёт undefined: этот шаг обрабатывает последнее число
  for (let i = 0; i <= s.length; i++) {
    const char = s[i];

    if (char >= "0" && char <= "9") {
      number = number * 10 + Number(char);
    } else if (char !== " ") {
      // char — оператор (или конец строки): применяем предыдущий оператор к собранному числу
      if (operator === "+") {
        stack.push(number);
      } else if (operator === "-") {
        stack.push(-number);
      } else if (operator === "*") {
        stack.push(stack.pop() * number);
      } else {
        stack.push(Math.trunc(stack.pop() / number));
      }

      operator = char;
      number = 0;
    }
  }

  return stack.reduce((sum, term) => sum + term, 0);
};

// Пример вызова:
console.log(calculate("3+2*2"));     // 7
console.log(calculate(" 3/2 "));     // 1
console.log(calculate(" 3+5 / 2 ")); // 5
console.log(calculate("14-3/2"));    // 13
