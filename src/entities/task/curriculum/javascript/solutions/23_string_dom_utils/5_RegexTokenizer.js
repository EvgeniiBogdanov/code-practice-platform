const tokenize = (input, tokenSpecs) => {
  if (typeof input !== "string") {
    return [];
  }

  const tokens = [];
  let cursor = 0;
  const len = input.length;

  while (cursor < len) {
    const remaining = input.slice(cursor);
    let matched = false;

    for (let i = 0; i < tokenSpecs.length; i++) {
      const spec = tokenSpecs[i];
      const match = spec.pattern.exec(remaining);

      if (match && match.index === 0) {
        const value = match[0];
        if (!spec.ignore) {
          tokens.push({
            type: spec.type,
            value,
            start: cursor,
            end: cursor + value.length,
          });
        }
        cursor += value.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      throw new SyntaxError(
        `Unexpected character: "${input[cursor]}" at index ${cursor}`
      );
    }
  }

  return tokens;
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
