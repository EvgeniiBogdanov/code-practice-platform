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
console.log(groupAnagrams(["stop", "pots", "melon", "tops", "lemon", "pear"])); // [["stop", "pots", "tops"], ["melon", "lemon"], ["pear"]]
