const truncate = (str, maxLength) =>
  // "…" — один символ, поэтому оставляем maxLength - 1 символов исходной строки
  str.length > maxLength ? `${str.slice(0, maxLength - 1)}…` : str;

// Пример вызова:
console.log(truncate("Вот, что мне хотелось бы сказать на эту тему:", 20)); // "Вот, что мне хотело…"
console.log(truncate("Всем привет!", 20)); // "Всем привет!"
console.log(truncate("abc", 3)); // "abc"
console.log(truncate("abcd", 3)); // "ab…"
