const scores = [3, 5, 4, 6, 5, 4];

const getStats = (arr) => {
  return arr.reduce((acc, num, index, array) => {
    return acc + num / array.length;
  }, 0);
};

console.log(getStats(scores)); // 4.5
