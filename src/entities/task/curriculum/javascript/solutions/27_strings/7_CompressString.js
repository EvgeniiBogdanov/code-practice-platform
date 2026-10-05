const compress = (str) => {
  const parts = [];
  let count = 1;

  for (let i = 0; i < str.length; i++) {
    // Серия продолжается — просто считаем
    if (str[i] === str[i + 1]) {
      count++;
      continue;
    }

    // Серия закончилась (следующий символ другой или строка кончилась)
    parts.push(count > 1 ? `${str[i]}${count}` : str[i]);
    count = 1;
  }

  return parts.join("");
};

// Пример вызова:
console.log(compress("aaabbc")); // "a3b2c"
console.log(compress("abc")); // "abc"
console.log(compress("aaaaaaaaaaaa")); // "a12"
console.log(compress("aabbaa")); // "a2b2a2"
console.log(compress("")); // ""
