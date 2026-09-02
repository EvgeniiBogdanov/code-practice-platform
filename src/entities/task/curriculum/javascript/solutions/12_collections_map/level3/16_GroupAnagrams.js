const groupAnagrams = (arr) => {
  const map = new Map();

  for (const str of arr) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);
  }

  return [...map.values()];
};

// Пример вызова:
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
