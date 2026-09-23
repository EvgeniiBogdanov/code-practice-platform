import type { AlgorithmInput, TraceStep } from "./algorithm-trace";
import { createTraceRecorder } from "../lib/trace-recorder";
import { tracePanel } from "./structure-scene";
import { createGridScene, type GridMode } from "./grid-scene";
import { scanOrangeSources } from "./grid-source-scan";

const gridTrace = (
  { grid: input = [], cell = [0, 0], parameter: color }: AlgorithmInput,
  mode: GridMode
): readonly TraceStep[] => {
  const grid = input.map((row) => [...row]);
  const width = grid[0]?.length ?? 0;
  const queue: number[] = [],
    done = new Set<number>(),
    discovered = new Set<number>();
  let head = 0,
    active = -1,
    count = 0,
    minutes = 0;
  let fresh = 0;
  const source = grid[cell[0]]?.[cell[1]];
  const coords = (id: number): readonly [number, number] => [Math.floor(id / width), id % width];
  const { steps, add } = createTraceRecorder(() => ({
    values: grid.flat(),
    pointers: [],
    structure: createGridScene({ grid, mode, active, queue, head, done }),
    panels: [
      tracePanel(
        "Очередь FIFO · координаты",
        queue.slice(head).map((id) => coords(id).join(","))
      ),
      tracePanel(
        "Состояние обхода",
        mode === "islands"
          ? [`Островов: ${count}`]
          : mode === "oranges"
            ? [`Минут: ${minutes}`, `Свежих: ${fresh}`]
            : [`Исходный цвет: ${source}`, `Новый цвет: ${color}`]
      ),
    ],
  }));
  const initialLine =
    mode === "islands"
      ? "let count = 0"
      : mode === "oranges"
        ? "let freshCount = 0"
        : "const sourceColor =";
  add(
    initialLine,
    mode === "oranges" ? "BFS из нескольких источников" : "BFS на сетке",
    "Соседи связаны только по стороне: вверх, вниз, влево, вправо."
  );
  const enqueue = (id: number): void => {
    queue.push(id);
    discovered.add(id);
  };
  if (mode === "oranges")
    scanOrangeSources({
      grid,
      add,
      enqueue,
      setActive: (id) => {
        active = id;
      },
      setFresh: (count) => {
        fresh = count;
      },
    });
  active = -1;
  if (mode === "flood") {
    add(
      "if (sourceColor === color)",
      "Проверяем исходный цвет",
      source === color ? "Новый цвет совпадает с исходным." : "Нужно перекрасить связную область."
    );
    if (source === color) {
      add("return image", "Цвет уже совпадает", "Сетка не меняется; очередь не запускается.", {
        result: grid.map((row) => [...row]),
      });
      return steps;
    }
    grid[cell[0]][cell[1]] = color;
    enqueue(cell[0] * width + cell[1]);
    add(
      "image[sr][sc] = color",
      "Перекрашиваем старт",
      "Помечаем ячейку при добавлении, чтобы не добавить её повторно."
    );
  }
  const drain = (): void => {
    while (head < queue.length && (mode !== "oranges" || fresh > 0)) {
      add(
        mode === "flood"
          ? "while (head < queue.length)"
          : mode === "oranges"
            ? "while (queue.length > 0 && freshCount > 0)"
            : "while (queue.length > 0)",
        "Проверяем очередь",
        `Ожидают обработки ${queue.length - head} ячеек.`
      );
      const end = queue.length;
      if (mode === "oranges")
        add(
          "const levelSize = queue.length",
          "Фиксируем волну",
          `В текущей минуте ${end - head} источников.`
        );
      while (head < end) {
        if (mode === "oranges")
          add(
            "for (let i = 0; i < levelSize; i += 1)",
            "Следующий источник волны",
            `Берём ячейку ${head + 1} из ${end}.`
          );
        active = queue[head++];
        const [r, c] = coords(active);
        add(
          mode === "flood"
            ? "const [row, column] = queue[head]"
            : "const [row, col] = queue.shift()",
          "Dequeue · обрабатываем ячейку",
          `Координаты [${r}, ${c}].`
        );
        if (mode === "flood")
          add("head++", "Сдвигаем голову очереди", `Следующий индекс: ${head}.`);
        const directions =
          mode === "flood"
            ? [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
              ]
            : [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
              ];
        for (const [dr, dc] of directions) {
          const nr = r + dr,
            nc = c + dc,
            id = nr * width + nc;
          add(
            mode === "flood"
              ? "for (const [rowOffset, columnOffset] of directions)"
              : "for (const [r, c] of neighbors)",
            "Проверяем соседа",
            `Координаты [${nr}, ${nc}].`
          );
          if (mode === "flood") {
            add("const nextRow = row + rowOffset", "Вычисляем строку", `nextRow = ${nr}.`);
            add(
              "const nextColumn = column + columnOffset",
              "Вычисляем столбец",
              `nextColumn = ${nc}.`
            );
          }
          const inBounds = nr >= 0 && nr < grid.length && nc >= 0 && nc < width;
          add(
            mode === "flood" ? "const isInside =" : "const inBounds =",
            "Проверяем границы",
            inBounds ? "Сосед внутри сетки." : "Сосед за границей сетки."
          );
          add(
            mode === "flood"
              ? "if (isInside && image[nextRow][nextColumn] === sourceColor)"
              : mode === "oranges"
                ? "if (inBounds && grid[r][c] === 1)"
                : "if (inBounds && grid[r][c] === '1')",
            "Проверяем состояние соседа",
            inBounds && !discovered.has(id) && grid[nr][nc] === (mode === "flood" ? source : 1)
              ? "Сосед подходит для расширения."
              : "Сосед не добавляется повторно."
          );
          if (
            nr < 0 ||
            nr >= grid.length ||
            nc < 0 ||
            nc >= width ||
            discovered.has(id) ||
            grid[nr][nc] !== (mode === "flood" ? source : 1)
          )
            continue;
          grid[nr][nc] = mode === "islands" ? 0 : mode === "oranges" ? 2 : color;
          add(
            mode === "flood"
              ? "image[nextRow][nextColumn] = color"
              : mode === "oranges"
                ? "grid[r][c] = 2"
                : "grid[r][c] = '0'",
            "Помечаем соседа",
            `Ячейка [${nr}, ${nc}] обновлена.`
          );
          if (mode === "oranges") {
            fresh--;
            add("freshCount -= 1", "Свежих стало меньше", `Осталось ${fresh}.`);
          }
          enqueue(id);
          add(
            mode === "flood" ? "queue.push([nextRow, nextColumn])" : "queue.push([r, c])",
            "Enqueue · расширяем область",
            `Ячейка [${nr}, ${nc}] помечена и добавлена в очередь.`
          );
        }
        done.add(active);
      }
      if (mode === "oranges") {
        minutes++;
        add(
          "minutes += 1",
          "Волна завершена",
          `Прошла минута ${minutes}; осталось свежих: ${fresh}.`
        );
      }
    }
  };
  if (mode === "islands") {
    for (let r = 0; r < grid.length; r++) {
      add(
        "for (let row = 0; row < rows; row += 1)",
        "Следующая строка карты",
        `Сканируем строку ${r}.`
      );
      for (let c = 0; c < width; c++) {
        active = r * width + c;
        add(
          "for (let col = 0; col < cols; col += 1)",
          "Следующая ячейка карты",
          `Проверяем [${r}, ${c}].`
        );
        add(
          "if (grid[row][col] === '1')",
          "Сканируем карту",
          `Проверяем [${r}, ${c}]: ${grid[r][c]}.`
        );
        if (grid[r][c] === 1) {
          count++;
          add("count += 1", "Новый остров", `Остров №${count}. Запускаем обход связной суши.`);
          grid[r][c] = 0;
          add(
            "grid[startRow][startCol] = '0'",
            "Помечаем старт",
            `Ячейка [${r}, ${c}] больше не будет посчитана повторно.`
          );
          enqueue(active);
          add("bfs(row, col)", "Запускаем BFS", `Расширяем остров №${count}.`);
          drain();
        }
      }
    }
  } else drain();
  active = -1;
  const result =
    mode === "islands"
      ? count
      : mode === "oranges"
        ? fresh
          ? -1
          : minutes
        : grid.map((row) => [...row]);
  if (mode === "oranges")
    add(
      "if (freshCount > 0)",
      "Проверяем результат волны",
      fresh ? `Недостижимых свежих апельсинов: ${fresh}.` : "Все свежие апельсины достигнуты."
    );
  add(
    mode === "islands"
      ? "return count"
      : mode === "oranges"
        ? fresh
          ? "return -1"
          : "return minutes"
        : "return image",
    mode === "oranges" && fresh ? "Есть недостижимые свежие апельсины" : "Обход завершён",
    mode === "oranges" && fresh
      ? "Очередь исчерпана, но свежие ячейки остались. Ответ −1."
      : "Все достижимые ячейки обработаны.",
    { result, occurrence: mode === "flood" ? 1 : 0 }
  );
  return steps;
};
export const buildIslandsTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  gridTrace(input, "islands");
export const buildOrangesTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  gridTrace(input, "oranges");
export const buildFloodTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  gridTrace(input, "flood");
