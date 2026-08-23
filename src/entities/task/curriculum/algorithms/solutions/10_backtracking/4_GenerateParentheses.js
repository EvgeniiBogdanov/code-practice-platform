const generateParenthesis = (n) => {
  const result = [];

  const backtrack = (current, open, close) => {
    if (current.length === n * 2) {
      result.push(current);
      return;
    }

    if (open < n) {
      backtrack(current + "(", open + 1, close);
    }

    if (close < open) {
      backtrack(current + ")", open, close + 1);
    }
  };

  backtrack("", 0, 0);
  return result;
};

// Пример вызова:
console.log(generateParenthesis(3)); // ["((()))", "(()())", "(())()", "()(())", "()()()"]
console.log(generateParenthesis(1)); // ["()"]
