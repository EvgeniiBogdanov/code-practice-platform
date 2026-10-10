const solution = (isBadVersion) => {
  return (n) => {
    let left = 1;
    let right = n;

    while (left < right) {
      const mid = Math.floor(left + (right - left) / 2);
      const isBad = isBadVersion(mid);

      if (isBad) {
        right = mid;
      }

      if (!isBad) {
        left = mid + 1;
      }
    }
    return left;
  };
};

// Пример вызова:
const isBadVersion1 = (version) => version >= 6;
console.log(solution(isBadVersion1)(10));         // 6

const isBadVersion2 = (version) => version >= 1;
console.log(solution(isBadVersion2)(3));          // 1

const isBadVersion3 = (version) => version >= 999999999;
console.log(solution(isBadVersion3)(2000000000)); // 999999999
