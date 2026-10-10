// В учебном плане numCourses курсов с номерами от 0 до numCourses - 1.
// Пара [a, b] в prerequisites означает: курс b нужно пройти до курса a.
//
// Напишите функцию canFinish(numCourses, prerequisites), которая возвращает true,
// если все курсы можно пройти в каком-то порядке, и false, если зависимости
// замыкаются в цикл.

const canFinish = (numCourses, prerequisites) => {
  // Решение тут
};

// Пример вызова:
console.log(canFinish(3, [[1, 0], [2, 0]]));                 // true
console.log(canFinish(3, [[0, 1], [1, 2], [2, 0]]));         // false
console.log(canFinish(4, [[1, 0], [2, 1], [3, 2], [1, 3]])); // false
console.log(canFinish(2, []));                               // true
