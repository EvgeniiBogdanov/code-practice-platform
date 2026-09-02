const customReplaceAll = (str, searchValue, replaceValue) => {
  if (str === null || str === undefined) {
    throw new TypeError("customReplaceAll called on null or undefined");
  }

  const string = String(str);

  if (searchValue instanceof RegExp) {
    if (!searchValue.global) {
      throw new TypeError(
        "String.prototype.replaceAll called with a non-global RegExp argument"
      );
    }
    return string.replace(searchValue, replaceValue);
  }

  const searchStr = String(searchValue);

  if (searchStr === "") {
    if (typeof replaceValue === "function") {
      const parts = [...string];
      let res = replaceValue("", 0, string);
      for (let i = 0; i < parts.length; i++) {
        res += parts[i] + replaceValue("", i + 1, string);
      }
      return res;
    }
    return replaceValue + [...string].join(replaceValue) + replaceValue;
  }

  if (typeof replaceValue === "function") {
    let result = "";
    let startIndex = 0;
    let matchIndex = string.indexOf(searchStr, startIndex);

    while (matchIndex !== -1) {
      result += string.slice(startIndex, matchIndex);
      result += String(replaceValue(searchStr, matchIndex, string));
      startIndex = matchIndex + searchStr.length;
      matchIndex = string.indexOf(searchStr, startIndex);
    }

    result += string.slice(startIndex);
    return result;
  }

  return string.split(searchStr).join(replaceValue);
};

// Пример вызова:
console.log(customReplaceAll("foo bar foo baz foo", "foo", "qux"));
// 'qux bar qux baz qux'

console.log(customReplaceAll("2 + 2 = 4", "+", "plus"));
// '2 plus 2 = 4'

// Проверка с RegExp c флагом /g:
console.log(customReplaceAll("abc 123 def 456", /\d+/g, "#"));
// 'abc # def #'

// Ошибка без флага /g:
try {
  customReplaceAll("abc", /a/);
} catch (e) {
  console.log(e.name); // 'TypeError'
}
