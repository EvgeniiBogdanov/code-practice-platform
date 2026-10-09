const longestPalindrome = (s) => {
  let start = 0;
  let maxLength = 0;

  // Расширяем два указателя от центра, пока символы совпадают; возвращаем длину палиндрома
  const expand = (left, right) => {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  };

  for (let i = 0; i < s.length; i++) {
    // Нечётный палиндром (центр — символ) и чётный (центр — между символами)
    const length = Math.max(expand(i, i), expand(i, i + 1));

    if (length > maxLength) {
      maxLength = length;
      start = i - Math.floor((length - 1) / 2);
    }
  }

  return s.slice(start, start + maxLength);
};

// Пример вызова:
console.log(longestPalindrome("bananas")); // "anana"
console.log(longestPalindrome("xyzzyq"));  // "yzzy"
console.log(longestPalindrome("noon"));    // "noon"
console.log(longestPalindrome("abcd"));    // "a"
