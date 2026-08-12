const groupAnagrams = (strs) => {
  const map = new Map();

  for (const str of strs) {
    const key = str.split("").sort().join("");

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(str);
  }

  return [...map.values()];
};

// Пример вызова:
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])); // [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]
console.log(groupAnagrams([""]));                                       // [[""]]
console.log(groupAnagrams(["a"]));                                      // [["a"]]
