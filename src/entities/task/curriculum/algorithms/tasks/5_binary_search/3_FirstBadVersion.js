// Напишите функцию solution(isBadVersion), которая возвращает функцию,
// принимающую общее количество версий (n) и возвращающую номер первой испорченной версии.
//
// Вам доступна функция isBadVersion(version), которая возвращает true,
// если версия является испорченной (бракованной), и false, если с ней всё в порядке.
// Если версия испорчена, то и все последующие версии за ней также являются испорченными.
//
// Главное условие:
// Функция должна находить первую испорченную версию за время O(log n),
// используя бинарный поиск для минимизации количества вызовов isBadVersion.
//
// Примеры:
// n = 5, первая испорченная = 4 -> solution(isBadVersion)(5) -> 4
// n = 1, первая испорченная = 1 -> solution(isBadVersion)(1) -> 1

const solution = (isBadVersion) => {
  return (n) => {
    // Решение тут
  };
};

// Пример вызова:
const isBadVersion1 = (version) => version >= 4;
console.log(solution(isBadVersion1)(5)); // 4

const isBadVersion2 = (version) => version >= 1;
console.log(solution(isBadVersion2)(1)); // 1
