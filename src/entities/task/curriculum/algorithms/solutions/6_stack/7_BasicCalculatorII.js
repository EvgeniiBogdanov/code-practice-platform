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
console.log(calculate("8-2*3"));      // 2
console.log(calculate(" 7 / 2 "));    // 3
console.log(calculate("1 + 10/3*2")); // 7
console.log(calculate("20-15/4"));    // 17
