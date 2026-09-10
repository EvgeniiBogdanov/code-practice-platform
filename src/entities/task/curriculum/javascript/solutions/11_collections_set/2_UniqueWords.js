const getUniqueWords = (text) => {
  return [...new Set(text.toLowerCase().split(" "))];
};

// Пример вызова:
console.log(getUniqueWords("яблоко банан ЯБЛОКО груша Банан")); // ["яблоко", "банан", "груша"]
