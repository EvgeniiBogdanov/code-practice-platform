const countOccurrencesMap = (arr) => {
  return arr.reduce((acc, el) => {
    acc.set(el, (acc.get(el) || 0) + 1);
    return acc;
  }, new Map());
};

console.log(countOccurrencesMap(['a', 'b', 'a', 'c', 'b', 'a']));
