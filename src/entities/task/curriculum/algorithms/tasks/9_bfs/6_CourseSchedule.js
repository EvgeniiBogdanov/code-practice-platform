// Напишите функцию canFinish(numCourses, prerequisites), которая определяет, можно ли
// пройти все курсы. Всего numCourses курсов с номерами от 0 до numCourses - 1.
//
// prerequisites[i] = [a, b] означает, что курс b нужно пройти раньше курса a.
//
// Верните true, если можно пройти все курсы, и false, если зависимости образуют цикл.
//
// Примеры:
// canFinish(2, [[1, 0]])                   -> true
// canFinish(2, [[1, 0], [0, 1]])           -> false
// canFinish(4, [[1, 0], [2, 1], [3, 2]])   -> true
// canFinish(3, [])                         -> true

const canFinish = (numCourses, prerequisites) => {
  // Решение тут
};

// Пример вызова:
console.log(canFinish(2, [[1, 0]]));                 // true
console.log(canFinish(2, [[1, 0], [0, 1]]));         // false
console.log(canFinish(4, [[1, 0], [2, 1], [3, 2]])); // true
console.log(canFinish(3, []));                       // true
