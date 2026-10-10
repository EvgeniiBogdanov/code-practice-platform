const decodeString = (s) => {
  // Стек хранит контексты внешних уровней: [строка до скобки, сколько раз повторить]
  const stack = [];
  let current = "";
  let count = 0;

  for (const char of s) {
    if (char >= "0" && char <= "9") {
      // Множитель может быть многозначным: "12[a]"
      count = count * 10 + Number(char);
    } else if (char === "[") {
      // Входим на уровень глубже: запоминаем внешний контекст и начинаем с чистого листа
      stack.push([current, count]);
      current = "";
      count = 0;
    } else if (char === "]") {
      // Закрываем уровень: повторяем накопленное и приклеиваем к внешней строке
      const [previous, times] = stack.pop();
      current = previous + current.repeat(times);
    } else {
      current += char;
    }
  }

  return current;
};

// Пример вызова:
console.log(decodeString("2[ab]3[c]")); // "ababccc"
console.log(decodeString("2[x3[y]]"));  // "xyyyxyyy"
console.log(decodeString("a2[bc]d"));   // "abcbcd"
console.log(decodeString("12[z]"));     // "zzzzzzzzzzzz"
