import type { AlgorithmInput, TraceStep, TraceStructure } from "./algorithm-trace";
import { createTraceRecorder } from "../lib/trace-recorder";
import { tracePanel } from "./structure-scene";

type GridMode = "islands" | "oranges" | "flood";
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
  let fresh = grid.flat().filter((value) => value === 1).length;
  const source = grid[cell[0]]?.[cell[1]];
  const coords = (id: number): readonly [number, number] => [Math.floor(id / width), id % width];
  const scene = (): TraceStructure => ({
    kind: "grid",
    label:
      mode === "islands"
        ? "Карта островов · 0 вода · 1 суша"
        : mode === "oranges"
          ? "Апельсины · 0 пусто · 1 свежий · 2 гнилой"
          : "Flood Fill · связная область одного цвета",
    nodes: grid.flatMap((row, r) =>
      row.map((value, c) => {
        const id = r * width + c;
        return {
          id: String(id),
          value,
          row: r,
          column: c,
          caption: `${r},${c}`,
          shape: mode === "oranges" && value !== 0 ? ("circle" as const) : ("box" as const),
          state:
            active === id
              ? ("active" as const)
              : queue.slice(head).includes(id)
                ? ("frontier" as const)
                : done.has(id)
                  ? ("done" as const)
                  : mode !== "flood" && value === 0
                    ? ("muted" as const)
                    : mode === "oranges" && value === 2
                      ? ("rejected" as const)
                      : undefined,
        };
      })
    ),
    edges: [],
  });
  const { steps, add } = createTraceRecorder(() => ({
    values: grid.flat(),
    pointers: [],
    structure: scene(),
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
    grid.flat().forEach((value, id) => {
      if (value === 2) enqueue(id);
    });
  if (mode === "flood") {
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
      const end = queue.length;
      while (head < end) {
        active = queue[head++];
        const [r, c] = coords(active);
        add(
          mode === "flood"
            ? "const [row, column] = queue[head]"
            : "const [row, col] = queue.shift()",
          "Dequeue · обрабатываем ячейку",
          `Координаты [${r}, ${c}].`
        );
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
          if (mode === "oranges") fresh--;
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
    for (let r = 0; r < grid.length; r++)
      for (let c = 0; c < width; c++) {
        active = r * width + c;
        add(
          "if (grid[row][col] === '1')",
          "Сканируем карту",
          `Проверяем [${r}, ${c}]: ${grid[r][c]}.`
        );
        if (grid[r][c] === 1) {
          count++;
          grid[r][c] = 0;
          enqueue(active);
          add(
            "count += 1",
            "Новый остров",
            `Остров №${count}. Обходим всю связанную сушу, прежде чем искать следующий.`
          );
          drain();
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
    { result }
  );
  return steps;
};
export const buildIslandsTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  gridTrace(input, "islands");
export const buildOrangesTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  gridTrace(input, "oranges");
export const buildFloodTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  gridTrace(input, "flood");
