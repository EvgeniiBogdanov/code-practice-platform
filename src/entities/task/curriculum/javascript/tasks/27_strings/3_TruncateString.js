// Усечение строки
// Напишите функцию truncate(str, maxLength). Если длина строки больше maxLength,
// обрежьте её и добавьте в конец символ многоточия "…" так, чтобы итоговая длина
// была ровно maxLength. Иначе верните строку без изменений.

const truncate = (str, maxLength) => {
  // Решение тут
};

// Пример вызова:
console.log(truncate("Вот, что мне хотелось бы сказать на эту тему:", 20)); // "Вот, что мне хотело…"
console.log(truncate("Всем привет!", 20)); // "Всем привет!"
console.log(truncate("abc", 3)); // "abc"
console.log(truncate("abcd", 3)); // "ab…"
