// Сборки проекта пронумерованы от 1 до n. С какой-то версии в код попала ошибка,
// и все сборки начиная с неё падают. Проверка сборки дорогая, поэтому вызывайте
// её как можно реже.
//
// Напишите функцию solution(isBadVersion): она получает функцию-проверку
// isBadVersion(version) (true — сборка падает) и возвращает функцию от n,
// которая находит номер первой падающей сборки за O(log n) вызовов проверки.

const solution = (isBadVersion) => {
  return (n) => {
    // Решение тут
  };
};

// Пример вызова:
const isBadVersion1 = (version) => version >= 6;
console.log(solution(isBadVersion1)(10));         // 6

const isBadVersion2 = (version) => version >= 1;
console.log(solution(isBadVersion2)(3));          // 1

const isBadVersion3 = (version) => version >= 999999999;
console.log(solution(isBadVersion3)(2000000000)); // 999999999
