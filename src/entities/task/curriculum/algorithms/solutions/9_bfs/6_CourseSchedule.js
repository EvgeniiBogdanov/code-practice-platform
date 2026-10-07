const canFinish = (numCourses, prerequisites) => {
  const graph = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);

  // Ребро prerequisite -> course; indegree — сколько курсов нужно пройти до данного
  for (const [course, prerequisite] of prerequisites) {
    graph[prerequisite].push(course);
    indegree[course]++;
  }

  // Начинаем с курсов без зависимостей
  const queue = [];
  for (let course = 0; course < numCourses; course++) {
    if (indegree[course] === 0) {
      queue.push(course);
    }
  }

  let processed = 0;

  // Индекс head вместо shift(): сдвиг массива стоил бы O(n) на каждом шаге
  for (let head = 0; head < queue.length; head++) {
    const course = queue[head];
    processed++;

    for (const next of graph[course]) {
      indegree[next]--;
      if (indegree[next] === 0) {
        queue.push(next);
      }
    }
  }

  // Курсы из цикла никогда не получают indegree 0, поэтому остаются необработанными
  return processed === numCourses;
};

// Пример вызова:
console.log(canFinish(2, [[1, 0]]));                 // true
console.log(canFinish(2, [[1, 0], [0, 1]]));         // false
console.log(canFinish(4, [[1, 0], [2, 1], [3, 2]])); // true
console.log(canFinish(3, []));                       // true
