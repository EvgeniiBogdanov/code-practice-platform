## 1. Паттерн и шаблон алгоритма

**Паттерн:** BFS (поиск в ширину)  
**Разновидность:** `BFS: Topological Sort + DP` (самое раннее время завершения на графе зависимостей)

### В чём суть паттерна и разновидности
Это алгоритм Кана из предыдущей задачи с одним дополнением: для каждой вершины мы храним **самое раннее время начала** `start`. Вершина может начаться только после завершения **всех** своих зависимостей, поэтому `start[next] = max(start[next], finish[prev])`. Топологический порядок гарантирует, что к моменту обработки вершины все её зависимости уже учтены. Ответ — максимум времени завершения по всем вершинам. Так находится **критический путь** проекта.

### Шаблон кода для запоминания синтаксиса
```javascript
// Шаблон: BFS: Topological Sort + DP (критический путь)
const criticalPathTemplate = (n, edges, duration) => {
  const graph = Array.from({ length: n + 1 }, () => []);
  const indegree = new Array(n + 1).fill(0);
  for (const [from, to] of edges) {
    graph[from].push(to);
    indegree[to]++;
  }

  const start = new Array(n + 1).fill(0);
  const queue = [];
  for (let node = 1; node <= n; node++) {
    if (indegree[node] === 0) queue.push(node);
  }

  let answer = 0;
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    const finish = start[node] + duration[node - 1];
    answer = Math.max(answer, finish);

    for (const next of graph[node]) {
      start[next] = Math.max(start[next], finish); // ждём самую долгую зависимость
      if (--indegree[next] === 0) queue.push(next);
    }
  }

  return answer;
};
```

---

## 2. Суть задачи

Есть `n` курсов (номера от 1). `relations[i] = [prev, next]` означает, что курс `prev` нужно
завершить до начала `next`. `time[i]` — длительность курса `i + 1` в месяцах. Курсы без
незавершённых зависимостей идут **параллельно**, их число не ограничено.
Найти минимальное число месяцев, за которое можно пройти все курсы.

```
n = 3, relations = [[1, 3], [2, 3]], time = [3, 2, 5]  ->  8
```

Курсы 1 и 2 идут одновременно и заканчиваются к месяцу `max(3, 2) = 3`, затем курс 3 длится 5 месяцев: `3 + 5 = 8`.

Такая же постановка встречается в [публичном отчёте участника контеста Т-Банка](https://habr.com/ru/articles/850926/)
(«Графы»: минимальное время, когда завершатся все процессы с зависимостями). Условие в статье
пересказано коротко, поэтому задача здесь взята как точный LeetCode-аналог (#2050).

## 3. Наивное решение (для понимания)

Для каждого курса рекурсивно искать самый долгий путь до него по зависимостям (DFS).

```js
const minimumTime = (n, relations, time) => {
  const prev = Array.from({ length: n + 1 }, () => []);
  for (const [from, to] of relations) prev[to].push(from);

  const finish = (course) =>
    time[course - 1] + Math.max(0, ...prev[course].map(finish));

  return Math.max(...Array.from({ length: n }, (_, i) => finish(i + 1)));
};
```

Без мемоизации одни и те же курсы пересчитываются много раз: время вырастает до **экспоненциального**
на графах с общими зависимостями. С мемоизацией задача решается за O(V + E), но рекурсия
может переполнить стек вызовов. Кан обходит всё итеративно.

## 4. Пошаговый разбор кода

```js
const minimumTime = (n, relations, time) => {
  const graph = Array.from({ length: n + 1 }, () => []);
  const indegree = new Array(n + 1).fill(0);

  for (const [prev, next] of relations) {
    graph[prev].push(next);
    indegree[next]++;
  }

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
      start[next] = Math.max(start[next], finish);
      indegree[next]--;
      if (indegree[next] === 0) {
        queue.push(next);
      }
    }
  }

  return answer;
};
```

1. Строим граф и `indegree`. Индексы массивов `graph`, `indegree`, `start` смещены на 1, чтобы номера курсов
   совпадали с индексами; `time` индексируется с нуля, отсюда `time[course - 1]`.
2. Курсы без зависимостей стартуют в месяц `0`.
3. Для извлечённого курса `finish = start + time`. Обновляем общий ответ.
4. Каждому следующему курсу передаём `finish` как кандидата на время начала: берём **максимум**,
   потому что курс стартует только после самой долгой зависимости.
5. Когда у курса не осталось зависимостей (`indegree = 0`), его `start` уже окончательный.

### Трассировка на примере `n = 5`, `relations = [[1,5],[2,5],[3,5],[3,4],[4,5]]`, `time = [1,2,3,4,5]`

| Курс | start | finish | Обновление зависимых |
|---|---|---|---|
| 1 | 0 | 1 | `start[5] = 1` |
| 2 | 0 | 2 | `start[5] = 2` |
| 3 | 0 | 3 | `start[5] = 3`, `start[4] = 3` |
| 4 | 3 | 7 | `start[5] = 7` |
| 5 | 7 | 12 | — |

Ответ: `12`.

---

## 5. Сложность и сравнение альтернатив

- **Время: O(n + E)**, где `E` — число зависимостей.
- **Память: O(n + E)**.

### Частые ошибки
- Суммировать времена всех курсов (так работает последовательное прохождение, а здесь курсы параллельны).
- Брать `start[next] = finish` без `max`: курс с несколькими зависимостями стартует раньше времени.
- Забыть сместить индексы: курсы нумеруются с 1, а `time` с 0.

## Альтернативный подход

**DFS с мемоизацией** (`finish[course]` считается один раз). Сложность та же, но рекурсивно и с риском
переполнения стека на длинных цепочках. Кан безопаснее и проще расширяется (например, для восстановления самого критического пути).
