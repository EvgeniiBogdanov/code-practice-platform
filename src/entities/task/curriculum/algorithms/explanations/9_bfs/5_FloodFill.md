## 1. Паттерн

**BFS: Flood Fill** — матрица рассматривается как граф: каждая клетка является вершиной, а четыре соседние клетки — рёбрами.

Задача изолирует три базовых действия grid-BFS:

1. добавить стартовую клетку в очередь;
2. проверить границы соседей;
3. пометить соседа посещённым до добавления в очередь.

## 2. Решение

Исходный цвет нужно сохранить до первой мутации. Если он уже равен новому цвету, следует сразу вернуть матрицу — иначе клетки будут добавляться повторно.

```javascript
const floodFill = (image, sr, sc, color) => {
  const sourceColor = image[sr][sc];
  if (sourceColor === color) return image;

  const queue = [[sr, sc]];
  let head = 0;
  image[sr][sc] = color;

  while (head < queue.length) {
    const [row, column] = queue[head++];

    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nextRow = row + dr;
      const nextColumn = column + dc;
      const isInside =
        nextRow >= 0 && nextRow < image.length &&
        nextColumn >= 0 && nextColumn < image[0].length;

      if (isInside && image[nextRow][nextColumn] === sourceColor) {
        image[nextRow][nextColumn] = color;
        queue.push([nextRow, nextColumn]);
      }
    }
  }

  return image;
};
```

## 3. Сложность

- Время: `O(m * n)` в худшем случае.
- Память: `O(m * n)` для очереди в худшем случае.

## 4. Частые ошибки

- Не обработать случай `sourceColor === color`.
- Помечать клетку только при извлечении: несколько соседей успеют добавить её повторно.
- Проверять значение клетки до проверки границ и обратиться к несуществующей строке.
- Добавлять диагональные направления, хотя по условию связность четырёхсторонняя.

## 5. Следующий шаг

`Number of Islands` повторяет тот же flood-fill, но запускает его много раз — по одному разу для каждой ещё не посещённой компоненты.
