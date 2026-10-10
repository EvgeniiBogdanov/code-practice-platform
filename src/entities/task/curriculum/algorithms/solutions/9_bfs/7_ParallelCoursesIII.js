const minimumTime = (n, relations, time) => {
  const graph = Array.from({ length: n + 1 }, () => []);
  const indegree = new Array(n + 1).fill(0);

  for (const [prev, next] of relations) {
    graph[prev].push(next);
    indegree[next]++;
  }

  // start[course] — самый ранний месяц начала: максимум по времени завершения всех зависимостей
  const start = new Array(n + 1).fill(0);
  const queue = [];

  for (let course = 1; course <= n; course++) {
    if (indegree[course] === 0) {
      queue.push(course);
    }
  }

  let answer = 0;

  for (let head = 0; head < queue.length; head++) {
    const course = queue[head];
    const finish = start[course] + time[course - 1];
    answer = Math.max(answer, finish);

    for (const next of graph[course]) {
      // Следующий курс ждёт самую долгую из своих зависимостей
      start[next] = Math.max(start[next], finish);
      indegree[next]--;
      if (indegree[next] === 0) {
        queue.push(next);
      }
    }
  }

  return answer;
};

// Пример вызова:
console.log(minimumTime(4, [[1, 2], [1, 3], [2, 4], [3, 4]], [2, 3, 1, 4])); // 9
console.log(minimumTime(3, [[1, 2], [2, 3]], [5, 5, 5]));                    // 15
console.log(minimumTime(3, [], [6, 1, 2]));                                  // 6
