const countWordFrequency = (text) => {
  const words = text.split(" ");
  const map = new Map();

  for (const word of words) {
    map.set(word, (map.get(word) || 0) + 1);
  }

  return map;
};

// Пример вызова:
const res = countWordFrequency("яблоко банан яблоко груша банан яблоко");
console.log(res.get("яблоко")); // 3
console.log(res.get("банан"));  // 2
console.log(res.get("груша"));  // 1
