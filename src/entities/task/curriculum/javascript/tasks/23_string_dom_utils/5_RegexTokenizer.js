// Лексический анализатор: Токенизация строки
// Реализуйте функцию tokenize(input, tokenSpecs), разбивающую строку input на поток токенов согласно массиву правил tokenSpecs.
//
// Структура правила: { type: string, pattern: RegExp, ignore?: boolean }
//
// Требования:
// 1. Последовательно сопоставляет начало оставшейся строки с переданными правилами.
// 2. Если ignore === true — совпадение пропускается (не добавляется в результат).
// 3. Для значащих токенов возвращает объект { type: spec.type, value: match[0], start: index, end: index + match[0].length }.
// 4. Если ни одно правило не подошло — выбрасывает SyntaxError.

const tokenize = (input, tokenSpecs) => {
  // Решение тут
};

// Пример вызова:
const specs = [
  { type: "WHITESPACE", pattern: /^\s+/, ignore: true },
  { type: "NUMBER", pattern: /^\d+(\.\d+)?/ },
  { type: "OP", pattern: /^[+\-*\/=]/ },
  { type: "IDENT", pattern: /^[a-zA-Z_]\w*/ },
];

console.log(tokenize("total = 100 + 45.5", specs));
// [
//   { type: 'IDENT', value: 'total', start: 0, end: 5 },
//   { type: 'OP', value: '=', start: 6, end: 7 },
//   { type: 'NUMBER', value: '100', start: 8, end: 11 },
//   { type: 'OP', value: '+', start: 12, end: 13 },
//   { type: 'NUMBER', value: '45.5', start: 14, end: 18 }
// ]
