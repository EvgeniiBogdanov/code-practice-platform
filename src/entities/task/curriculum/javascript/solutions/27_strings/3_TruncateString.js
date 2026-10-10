const truncate = (str, maxLength) =>
  // "…" — один символ, поэтому оставляем maxLength - 1 символов исходной строки
  str.length > maxLength ? `${str.slice(0, maxLength - 1)}…` : str;

// Пример вызова:
console.log(truncate("Сегодня в программе: замыкания и прототипы", 20)); // "Сегодня в программе…"
console.log(truncate("Короткий текст", 20)); // "Короткий текст"
console.log(truncate("abc", 3)); // "abc"
console.log(truncate("abcd", 3)); // "ab…"
