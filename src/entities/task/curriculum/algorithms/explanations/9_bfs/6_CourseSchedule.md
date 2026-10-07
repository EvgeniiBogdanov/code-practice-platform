## 1. Паттерн и шаблон алгоритма

**Паттерн:** BFS (поиск в ширину)  
**Разновидность:** `BFS: Topological Sort (алгоритм Кана)` — обход графа зависимостей по степеням входа

### В чём суть паттерна и разновидности
Если задачи зависят друг от друга (граф без циклов, DAG), порядок выполнения можно найти BFS-ом по **степени входа** (`indegree` — сколько зависимостей ещё не выполнено). В очередь попадают вершины с `indegree = 0`. После обработки вершины мы «снимаем» её зависимость с соседей, и те, у кого `indegree` стал `0`, добавляются в очередь. Если в графе есть **цикл**, вершины цикла никогда не получат `indegree = 0` и останутся необработанными.

### Шаблон кода для запоминания синтаксиса
```javascript
// Шаблон: BFS: Topological Sort (алгоритм Кана)
const topologicalTemplate = (n, edges) => {
  const graph = Array.from({ length: n }, () => []);
  const indegree = new Array(n).fill(0);

  for (const [from, to] of edges) {
    graph[from].push(to);
    indegree[to]++;
  }

  const queue = [];
  for (let node = 0; node < n; node++) {
    if (indegree[node] === 0) queue.push(node);
  }

  const order = [];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    order.push(node);

    for (const next of graph[node]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }

  return order; // order.length < n, если в графе есть цикл
};
```

---

## 2. Суть задачи

Есть `numCourses` курсов. Пара `[a, b]` в `prerequisites` означает: курс `b` нужно пройти раньше курса `a`.
Можно ли пройти все курсы? Иначе говоря, **нет ли цикла** в графе зависимостей.

```
canFinish(2, [[1, 0]])          -> true   (0 → 1)
canFinish(2, [[1, 0], [0, 1]])  -> false  (0 → 1 → 0, цикл)
```

## 3. Наивное решение (для понимания)

Для каждого курса запускать DFS и искать путь, возвращающийся в него.

- Без запоминания уже проверенных вершин время может доходить до **O(V · (V + E))**.
- С цветной разметкой DFS (не посещён / в обработке / завершён) задача решается за O(V + E),
  но алгоритм Кана проще объяснить и написать без рекурсии.

## 4. Пошаговый разбор кода

```js
const canFinish = (numCourses, prerequisites) => {
  const graph = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);

  for (const [course, prerequisite] of prerequisites) {
    graph[prerequisite].push(course);
    indegree[course]++;
  }

  const queue = [];
  for (let course = 0; course < numCourses; course++) {
    if (indegree[course] === 0) {
      queue.push(course);
    }
  }

  let processed = 0;

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

  return processed === numCourses;
};
```

1. **Граф.** Для пары `[course, prerequisite]` строим ребро `prerequisite → course` и увеличиваем
   `indegree[course]`.
2. **Старт.** В очередь кладём курсы без зависимостей.
3. **Обход.** Достаём курс, считаем его пройденным (`processed++`) и уменьшаем `indegree`
   у всех курсов, которые от него зависят. Как только у курса не осталось невыполненных
   зависимостей, он попадает в очередь.
4. **Ответ.** Если пройдены все курсы, цикла нет. Иначе часть курсов осталась «заблокированной»
   друг другом.
5. **`head` вместо `shift()`.** `shift()` сдвигает весь массив, это O(n) на каждую операцию.
   Индекс `head` делает извлечение из очереди O(1).

### Трассировка на примере `canFinish(2, [[1, 0], [0, 1]])`

`indegree = [1, 1]`: у обоих курсов есть невыполненная зависимость, очередь пуста,
`processed = 0 ≠ 2`, ответ `false`.

### Трассировка на примере `canFinish(4, [[1, 0], [2, 1], [3, 2]])`

| Шаг | Очередь | indegree (0,1,2,3) | processed |
|---|---|---|---|
| старт | `[0]` | `[0, 1, 1, 1]` | 0 |
| берём 0 | `[0, 1]` | `[0, 0, 1, 1]` | 1 |
| берём 1 | `[0, 1, 2]` | `[0, 0, 0, 1]` | 2 |
| берём 2 | `[0, 1, 2, 3]` | `[0, 0, 0, 0]` | 3 |
| берём 3 | | | 4 → `true` |

---

## 5. Сложность и сравнение альтернатив

- **Время: O(V + E)** — каждую вершину и каждое ребро обрабатываем один раз.
- **Память: O(V + E)** — список смежности, `indegree` и очередь.

## Альтернативный подход

**DFS с тремя цветами** (белый, серый, чёрный): если при обходе встретили серую вершину,
то нашли цикл. Это тоже O(V + E), но рекурсия может переполнить стек вызовов на длинных цепочках.
Алгоритм Кана ещё и сразу даёт сам порядок прохождения (для LeetCode «Course Schedule II», #210).
Он же лежит в основе следующей задачи группы — «Parallel Courses III», где добавляется время.
