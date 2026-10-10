const lengthOfLongestSubstring = (s) => {
  const set = new Set();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }

    set.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
};

// Пример вызова:
console.log(lengthOfLongestSubstring("pizzaparty")); // 5
console.log(lengthOfLongestSubstring("aaaa"));       // 1
console.log(lengthOfLongestSubstring("abba"));       // 2
console.log(lengthOfLongestSubstring("qwerty"));     // 6
