// Корректный разворот строки с поддержкой Unicode
// Напишите функцию reverseUnicodeString(str), которая возвращает развернутую строку с корректным сохранением суррогатных пар (эмодзи и специальных символов Unicode).
//
// Требования:
// 1. Если аргумент не является строкой — возвращает пустую строку "".
// 2. Корректно обрабатывает символы вне базовой многоязычной плоскости (BMP), сохраняя суррогатные пары.

const reverseUnicodeString = (str) => {
  // Решение тут
};

// Пример вызова:
console.log(reverseUnicodeString("hello"));       // 'olleh'
console.log(reverseUnicodeString("foo 🚀 bar"));   // 'rab 🚀 oof'
console.log(reverseUnicodeString("👋 Привет 🌍")); // '🌍 тевирП 👋'
