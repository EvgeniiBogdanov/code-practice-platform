// Реализация полифила String.prototype.replaceAll
// Реализуйте функцию customReplaceAll(str, searchValue, replaceValue).
//
// Требования:
// 1. Если searchValue является RegExp без глобального флага 'g' — выбрасывает TypeError.
// 2. Если searchValue — строка, заменяются все её вхождения в исходной строке str.
// 3. Аргумент replaceValue может быть строкой или функцией обратного вызова callback(match, offset, string).

const customReplaceAll = (str, searchValue, replaceValue) => {
  // Решение тут
};

// Пример вызова:
console.log(customReplaceAll("foo bar foo baz foo", "foo", "qux")); // 'qux bar qux baz qux'
console.log(customReplaceAll("2 + 2 = 4", "+", "plus"));            // '2 plus 2 = 4'
console.log(customReplaceAll("abc 123 def 456", /\d+/g, "#"));      // 'abc # def #'
